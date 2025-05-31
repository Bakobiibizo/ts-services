import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import { promisify } from 'util';

const exec = promisify(child_process.exec);
import { CodeBlock } from './code_block';

// Path to the Rust binary (will be built in the same directory)
const RUST_EXTRACTOR_PATH = path.join(
    __dirname,
    'external_programs',
    'extract_rust_blocks',
    'target',
    'release',
    'extract_rust_blocks'
);

/**
 * Executes a command and returns the result
 */
async function executeCommand(command: string, args: string[]): Promise<{stdout: string, stderr: string}> {
    try {
        const { stdout, stderr } = await exec(`${command} ${args.map(arg => `"${arg}"`).join(' ')}`);
        return { stdout: stdout.trim(), stderr: stderr.trim() };
    } catch (error: any) {
        // exec throws an error if the command fails, but we want to handle it ourselves
        return {
            stdout: error.stdout?.toString().trim() || '',
            stderr: error.stderr?.toString().trim() || error.message
        };
    }
}

/**
 * Builds the Rust extractor if it doesn't exist
 */
async function ensureRustExtractorBuilt(): Promise<void> {
    if (!fs.existsSync(RUST_EXTRACTOR_PATH)) {
        console.log('Building Rust code extractor...');
        const { stdout, stderr } = await executeCommand('cargo', [
            'build',
            '--release',
            '--manifest-path',
            path.join(__dirname, 'external_programs', 'extract_rust_blocks', 'Cargo.toml')
        ]);
        
        if (stderr) {
            console.error('Error building Rust extractor:', stderr);
            throw new Error('Failed to build Rust code extractor');
        }
        
        console.log('Successfully built Rust code extractor');
    }
}

/**
 * Extracts code blocks from a Rust file using the Rust extractor
 * @param filePath Path to the Rust file to extract code blocks from
 * @returns A promise that resolves to a string containing the extracted code blocks
 */
export async function extractRustCode(filePath: string): Promise<string> {
    try {
        // Ensure the Rust extractor is built
        await ensureRustExtractorBuilt();
        
        // Execute the Rust extractor
        const { stdout, stderr } = await executeCommand(RUST_EXTRACTOR_PATH, [filePath]);

        // Parse the JSON output
        let result;
        try {
            // The output might contain warnings, so try to find the JSON part
            const jsonStart = stdout.indexOf('{');
            const jsonEnd = stdout.lastIndexOf('}') + 1;
            const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart 
                ? stdout.substring(jsonStart, jsonEnd) 
                : stdout;
                
            result = JSON.parse(jsonStr);
            
            // Handle error responses from the script
            if (!result.success) {
                console.error(`Rust extractor error: ${result.error || 'Unknown error'}`);
                return fs.readFileSync(filePath, 'utf8');
            }
        } catch (e) {
            console.error('Failed to parse Rust extractor output:', e);
            console.error('Raw output:', stdout);
            console.error('Stderr:', stderr);
            return fs.readFileSync(filePath, 'utf8');
        }

        // Format the blocks with enhanced metadata
        if (Array.isArray(result.blocks)) {
            return result.blocks.map((block: CodeBlock) => {
                const header = [
                    `# ${block.type} ${block.name || ''}`,
                    `Language: rust`,
                    block.startLine !== undefined && `Lines: ${block.startLine}-${block.endLine || '?'}`
                ].filter(Boolean).join(' | ');
                
                const doc = block.documentation 
                    ? `/*!
${block.documentation}
*/

`
                    : '';
                
                return `${header}
${doc}${block.source}
`;
            }).join('\n');
        }
        
        // Fallback to full file content if no blocks were found
        return fs.readFileSync(filePath, 'utf8');
        
    } catch (error) {
        console.error('Error extracting Rust code:', error);
        return fs.readFileSync(filePath, 'utf8');
    }
}

/**
 * Synchronous version of extractRustCode
 * @param filePath Path to the Rust file to extract code blocks from
 * @returns A string containing the file content (synchronous fallback)
 */
export function extractRustCodeSync(filePath: string): string {
    try {
        // For synchronous version, we'll just return the file content
        // as we can't easily run the Rust extractor synchronously
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading Rust file:', error);
        return '';
    }
}
