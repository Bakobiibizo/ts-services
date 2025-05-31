import { extractPythonCode } from '../src/data-Ingestor/extractPythonCode';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    try {
        // Path to our test Python file
        const testDir = path.join(__dirname, 'python');
        const pythonFilePath = path.join(testDir, 'test_script.py');
        
        // Create test directory if it doesn't exist
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        
        // Create a test Python file if it doesn't exist
        if (!fs.existsSync(pythonFilePath)) {
            const testCode = `"""
Test Python script for testing the Python code extractor.
This script contains various Python constructs to test the extractor.
"""

def hello_world():
    """A simple function that prints hello world"""
    print("Hello, world!")


class TestClass:
    """A test class for demonstration"""
    
    def __init__(self, name: str):
        """Initialize the TestClass with a name.
        
        Args:
            name: The name to use for greeting
        """
        self.name = name
    
    def greet(self) -> None:
        """Greets the user with the stored name"""
        print(f"Hello, {self.name}!")


async def async_example() -> str:
    """An example async function.
    
    Returns:
        str: A greeting message
    """
    return "This is an async function"


if __name__ == "__main__":
    # Example usage
    hello_world()
    test = TestClass("Tester")
    test.greet()`;
            
            fs.writeFileSync(pythonFilePath, testCode);
            console.log(`Created test file: ${pythonFilePath}`);
        }
        
        console.log(`Testing with file: ${pythonFilePath}`);
        console.log('----------------------------------------');
        
        // Test the async version
        console.log('\nExtracting code blocks...');
        
        // First, verify the Python script exists and is readable
        const pythonScriptPath = path.join(
            __dirname,
            '..',
            'src',
            'data-Ingestor',
            'external_programs',
            'extract_python_blocks.py'
        );
        
        if (!fs.existsSync(pythonScriptPath)) {
            console.error(`❌ Python script not found at: ${pythonScriptPath}`);
            process.exit(1);
        }
        
        console.log(`✅ Found Python script at: ${pythonScriptPath}`);
        
        // Run the Python script directly to test it
        console.log('\nRunning Python script directly...');
        try {
            const { execSync } = require('child_process');
            const output = execSync(`python3 "${pythonScriptPath}" "${pythonFilePath}"`).toString();
            console.log('\nPython script output:');
            console.log('-------------------');
            console.log(output);
            
            // Try to parse the JSON output
            try {
                const result = JSON.parse(output);
                console.log('\nParsed JSON output:');
                console.log(JSON.stringify(result, null, 2));
            } catch (e) {
                console.error('\nFailed to parse JSON output:', e);
            }
        } catch (error: any) {
            console.error('\nError running Python script:');
            console.error('--------------------------');
            console.error('Error:', error.message);
            console.error('\nStderr:');
            console.error(error.stderr?.toString() || 'No stderr');
            console.error('\nStdout:');
            console.error(error.stdout?.toString() || 'No stdout');
            process.exit(1);
        }
        
        // Now try with our extractor
        console.log('\nRunning through TypeScript extractor...');
        const result = await extractPythonCode(pythonFilePath);
        
        console.log('\nExtracted code blocks:');
        console.log('----------------------');
        console.log(result);
        
        // Verify the output contains expected elements
        const testCases = [
            { type: 'FunctionDef', name: 'hello_world' },
            { type: 'ClassDef', name: 'TestClass' },
            { type: 'AsyncFunctionDef', name: 'async_example' }
        ];
        
        // Split the result into blocks (each block starts with #)
        const blocks = result.split(/\n(?=# )/);
        
        // Check each expected block
        for (const test of testCases) {
            const block = blocks.find(b => 
                b.startsWith(`# ${test.type} ${test.name} |`)
            );
            
            if (!block) {
                console.error(`❌ Missing ${test.type} ${test.name} in output`);
                continue;
            }
            
            console.log(`✅ Found ${test.type} ${test.name}`);
            
            // Verify block contains source code
            if (!block.includes('def ') && !block.includes('class ')) {
                console.error(`❌ ${test.type} ${test.name} is missing source code`);
            }
            
            // For hello_world, verify docstring is included
            if (test.name === 'hello_world' && 
                !block.includes('A simple function that prints hello world')) {
                console.error('❌ Missing docstring for hello_world');
            }
        }
        
        // Verify we have the expected number of blocks (3 functions + 2 methods in TestClass)
        const expectedBlockCount = 5;
        if (blocks.length < expectedBlockCount) {
            console.error(`❌ Expected at least ${expectedBlockCount} code blocks, found ${blocks.length}`);
        } else {
            console.log(`✅ Found ${blocks.length} code blocks`);
        }
        
        // Save the output to a file for inspection
        const outputPath = path.join(testDir, 'extracted_blocks.txt');
        fs.writeFileSync(outputPath, result);
        console.log(`\nOutput saved to: ${outputPath}`);
        
        console.log('\nTest completed!');
    } catch (error) {
        console.error('Error during test:', error);
        process.exit(1);
    }
}

// Run the test
main().catch(console.error);
