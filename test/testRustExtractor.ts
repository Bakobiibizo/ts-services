import { extractRustCode } from '../src/data-Ingestor/extractRustCode';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    try {
        // Path to our test Rust file
        const testDir = path.join(__dirname, 'rust');
        const rustFilePath = path.join(testDir, 'test_script.rs');
        
        // Create test directory if it doesn't exist
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        
        // Create a test Rust file if it doesn't exist
        if (!fs.existsSync(rustFilePath)) {
            const testCode = `//! Test Rust script for testing the Rust code extractor.
//! This script contains various Rust constructs to test the extractor.

/// A simple function that greets the user
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

/// A simple struct representing a person
#[derive(Debug, Clone)]
pub struct Person {
    /// The person's name
    pub name: String,
    /// The person's age
    pub age: u32,
}

impl Person {
    /// Creates a new Person instance
    pub fn new(name: &str, age: u32) -> Self {
        Self {
            name: name.to_string(),
            age,
        }
    }
    
    /// Returns a greeting message
    pub fn greet(&self) -> String {
        format!("Hello, my name is {} and I'm {} years old.", self.name, self.age)
    }
}

/// A simple trait for greeting
pub trait Greeter {
    /// Returns a greeting message
    fn say_hello(&self) -> String;
}

impl Greeter for Person {
    fn say_hello(&self) -> String {
        format!("Hello from {}!", self.name)
    }
}

/// An enum representing different types of messages
#[derive(Debug)]
pub enum Message {
    /// A simple text message
    Text(String),
    /// A numeric message
    Number(i32),
    /// A structured message with a name and value
    Data { name: String, value: i32 },
}

impl Message {
    /// Returns the message as a string
    pub fn to_string(&self) -> String {
        match self {
            Message::Text(text) => text.clone(),
            Message::Number(n) => n.to_string(),
            Message::Data { name, value } => format!("{}: {}", name, value),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_greet() {
        assert_eq!(greet("World"), "Hello, World!");
    }
    
    #[test]
    fn test_person_greet() {
        let person = Person::new("Alice", 30);
        assert!(person.greet().contains("Alice"));
        assert!(person.greet().contains("30"));
    }
}

fn main() {
    // Example usage
    let greeting = greet("Rust");
    println!("{}", greeting);
    
    let alice = Person::new("Alice", 30);
    println!("{}", alice.greet());
    println!("{}", alice.say_hello());
    
    let msg = Message::Text("Hello, Rust!".to_string());
    println!("Message: {}", msg.to_string());
}`;
            
            fs.writeFileSync(rustFilePath, testCode);
            console.log(`Created test file: ${rustFilePath}`);
        }
        
        console.log(`Testing with file: ${rustFilePath}`);
        console.log('----------------------------------------');
        
        // Test the async version
        console.log('\nExtracting code blocks...');
        const result = await extractRustCode(rustFilePath);
        
        console.log('\nExtracted code blocks:');
        console.log('----------------------');
        console.log(result);
        
        // Verify the output contains expected elements
        const testCases = [
            { type: 'Function', name: 'greet' },
            { type: 'Struct', name: 'Person' },
            { type: 'Trait', name: 'Greeter' },
            { type: 'Enum', name: 'Message' },
            { type: 'Function', name: 'new' },
            { type: 'Function', name: 'greet' },
            { type: 'Function', name: 'say_hello' },
            { type: 'Function', name: 'to_string' }
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
            if (!block.includes('fn ') && !block.includes('struct ') && 
                !block.includes('trait ') && !block.includes('enum ')) {
                console.error(`❌ ${test.type} ${test.name} is missing source code`);
            }
            
            // For greet function, verify docstring is included
            if (test.name === 'greet' && !block.includes('A simple function that greets the user')) {
                console.error('❌ Missing docstring for greet function');
            }
        }
        
        // Save the output to a file for inspection
        const outputPath = path.join(testDir, 'extracted_blocks.txt');
        fs.writeFileSync(outputPath, result);
        console.log(`\nOutput saved to: ${outputPath}`);
        
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Run the test
main().catch(console.error);
