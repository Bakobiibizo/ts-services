import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import * as util from 'util';

const exec = util.promisify(child_process.exec);
import { CodeBlock } from './code_block';

// Path to the Python script
const PYTHON_SCRIPT_PATH = path.join(
    __dirname,
    'external_programs',
    'extract_python_blocks.py'
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
 * Extracts code blocks from a Python file using an external Python script with uv
 * @param filePath Path to the Python file to extract code blocks from
 * @returns A promise that resolves to a string containing the extracted code blocks
 */
export async function extractPythonCode(filePath: string): Promise<string> {
    try {
        // Execute the Python script directly with python3 instead of uv run
        const { stdout, stderr } = await executeCommand(
            'python3',
            [PYTHON_SCRIPT_PATH, filePath]
        );

        // Parse the JSON output
        let result;
        try {
            // The output might contain deprecation warnings, so try to find the JSON part
            const jsonStart = stdout.indexOf('{');
            const jsonEnd = stdout.lastIndexOf('}') + 1;
            const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart 
                ? stdout.substring(jsonStart, jsonEnd) 
                : stdout;
                
            result = JSON.parse(jsonStr);
            
            // Handle error responses from the script
            if (!result.success) {
                console.error(`Python script error: ${result.error || 'Unknown error'}`);
                return fs.readFileSync(filePath, 'utf8');
            }
        } catch (e) {
            console.error('Failed to parse Python script output:', e);
            console.error('Raw output:', stdout);
            console.error('Stderr:', stderr);
            return fs.readFileSync(filePath, 'utf8');
        }

        // Format the blocks with enhanced metadata
        if (Array.isArray(result.blocks)) {
            return result.blocks.map((block: CodeBlock) => {
                const header = [
                    `# ${block.type} ${block.name || ''}`,
                    block.language && `Language: ${block.language}`,
                    block.startLine !== undefined && `Lines: ${block.startLine}-${block.endLine || '?'}`
                ].filter(Boolean).join(' | ');
                
                const doc = block.documentation 
                    ? `"""
${block.documentation}
"""\n\n`
                    : '';
                
                return `${header}\n${doc}${block.source}\n`;
            }).join('\n');
        }
        
        // Fallback to full file content if no blocks were found
        return fs.readFileSync(filePath, 'utf8');
        
    } catch (error) {
        console.error('Error extracting Python code:', error);
        return fs.readFileSync(filePath, 'utf8');
    }
}

/**
 * Synchronous version of extractPythonCode
 * @param filePath Path to the Python file to extract code blocks from
 * @returns A string containing the file content (synchronous fallback)
 */
export function extractPythonCodeSync(filePath: string): string {
    try {
        // For synchronous version, we'll just return the file content
        // as the AST parsing requires async operations
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading Python file ${filePath}:`, error);
        return '';
    }
}
