import * as path from 'path';
import * as fs from 'fs';
import DataIngestor from '../src/data-Ingestor/DataIngestor';

// Create a test Rust file
const testRustFile = path.join(__dirname, 'test_rust.rs');
const testContent = `
// This is a test Rust file

/// A simple function that adds two numbers
fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// A simple struct
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    /// Creates a new Point
    fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }
}
`;

// Create the test file
fs.writeFileSync(testRustFile, testContent);

// Test the Rust extractor
async function testRustExtractor() {
    try {
        console.log('Testing Rust extractor integration...');
        
        // Initialize DataIngestor
        DataIngestor.createMirrorDirectory();
        
        // Process the test file
        await DataIngestor.ingestFile(testRustFile);
        
        // Check if the file was processed
        if (DataIngestor.dataMap[testRustFile]) {
            console.log('✅ Rust file processed successfully!');
            console.log('Extracted content:');
            console.log(DataIngestor.dataMap[testRustFile]);
            
            // Verify the mirror file was created
            const mirrorPath = path.join(
                DataIngestor.mirrorDirectory, 
                path.relative(process.cwd(), testRustFile)
            );
            
            if (fs.existsSync(mirrorPath)) {
                console.log('✅ Mirror file created successfully!');
            } else {
                console.error('❌ Mirror file was not created');
            }
        } else {
            console.error('❌ Failed to process Rust file');
        }
    } catch (error) {
        console.error('❌ Error testing Rust extractor:', error);
    } finally {
        // Clean up
        if (fs.existsSync(testRustFile)) {
            fs.unlinkSync(testRustFile);
        }
    }
}

// Run the test with proper async/await
(async () => {
    try {
        await testRustExtractor();
    } catch (error) {
        console.error('❌ Unhandled error in test:', error);
        process.exit(1);
    }
})();
