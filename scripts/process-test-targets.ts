import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { DocumentationGenerator } from '../src/utils/documentation-generator.js';
import type { 
  ProjectMetadata, 
  Method, 
  Param, 
  Example, 
  DocumentationStatus, 
  ComplexityLevel 
} from '../src/types/wiki-schema.js';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the test targets directory
const TEST_TARGETS_DIR = path.join(__dirname, '..', 'test_targets');
const OUTPUT_DIR = path.join(__dirname, '..', 'docs-output');

// Main function to run the script
async function main() {
  // Ensure output directory exists
  try {
    await fs.access(OUTPUT_DIR);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(OUTPUT_DIR, { recursive: true });
    } else {
      throw error;
    }
  }

  // Process test targets
  try {
    // Get all test targets
    const dirents = await fs.readdir(TEST_TARGETS_DIR, { withFileTypes: true });
    const targets = dirents
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found test targets: ${targets.join(', ')}`);
    
    // Process each target
    for (const target of targets) {
      await processTarget(target);
    }
    
    console.log('\n✅ All targets processed successfully!');
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error processing targets:', errorMessage);
    process.exit(1);
  }
}

// Process a single test target
export async function processTarget(targetName: string) {
  console.log(`\nProcessing target: ${targetName}`);
  const targetPath = path.join(TEST_TARGETS_DIR, targetName);
  
  // Initialize documentation generator with basic project info
  const projectMetadata: ProjectMetadata = {
    name: `Documentation - ${targetName}`,
    description: `Automatically generated documentation for ${targetName} test target`,
    version: '0.1.0',
    repository: '',
    documentation_status: 'draft',
    coverage: 0,
    last_updated: new Date().toISOString()
  };

  const generator = new DocumentationGenerator(projectMetadata);

  // Process based on target type
  switch (targetName) {
    case 'typescript_target':
      await processTypeScriptTarget(generator, targetPath);
      break;
    case 'rust_target':
      await processRustTarget(generator, targetPath);
      break;
    case 'python_target':
    case 'html_python_target':
      await processPythonTarget(generator, targetPath);
      break;
    default:
      console.warn(`No specific processor for target: ${targetName}`);
  }

  // Generate and save documentation
  const docs = generator.generate();
  const outputPath = path.join(OUTPUT_DIR, `${targetName}.json`);
  await fs.writeFile(outputPath, JSON.stringify(docs, null, 2));
  console.log(`✅ Documentation generated: ${outputPath}`);
}

// Process TypeScript target
async function processTypeScriptTarget(generator: DocumentationGenerator, targetPath: string) {
  console.log('Processing TypeScript target...');
  
  // Add modules for different parts of the application
  const modules = [
    {
      name: 'core',
      description: 'Core functionality and utilities',
      status: 'documented' as const,
      version_added: '0.1.0',
      complexity: 'medium' as const,
      last_updated: new Date().toISOString(),
      components: []
    },
    {
      name: 'handlers',
      description: 'Request handlers and API endpoints',
      status: 'documented' as const,
      version_added: '0.1.0',
      complexity: 'medium' as const,
      last_updated: new Date().toISOString(),
      components: []
    },
    {
      name: 'utils',
      description: 'Utility functions and helpers',
      status: 'documented' as const,
      version_added: '0.1.0',
      complexity: 'low' as const,
      last_updated: new Date().toISOString(),
      components: []
    },
    {
      name: 'db',
      description: 'Database models and operations',
      status: 'documented' as const,
      version_added: '0.1.0',
      complexity: 'high' as const,
      last_updated: new Date().toISOString(),
      components: []
    }
  ];

  // Add all modules to the generator
  for (const module of modules) {
    generator.addModule(module);
  }

  // Process files in the target directory
  await processDirectory(targetPath, generator);
}

// Process a directory recursively
async function processDirectory(dirPath: string, generator: DocumentationGenerator, relativePath = '') {
  try {
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const dirent of dirents) {
      const fullPath = path.join(dirPath, dirent.name);
      const relPath = path.join(relativePath, dirent.name);
      
      if (dirent.isDirectory()) {
        // Skip node_modules and other common directories
        if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(dirent.name)) {
          continue;
        }
        await processDirectory(fullPath, generator, relPath);
      } else if (dirent.isFile() && isSourceFile(dirent.name)) {
        await processSourceFile(fullPath, relPath, generator);
      }
    }
  } catch (error: any) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

// Check if a file is a source file we want to process
function isSourceFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
}

// Process a single source file
async function processSourceFile(filePath: string, relPath: string, generator: DocumentationGenerator) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    
    // Determine module based on directory structure
    let moduleName = 'core';
    if (relPath.includes('handlers/') || relPath.includes('routes/') || relPath.includes('api/')) {
      moduleName = 'handlers';
    } else if (relPath.includes('utils/') || relPath.includes('helpers/') || relPath.includes('lib/')) {
      moduleName = 'utils';
    } else if (relPath.includes('db/') || relPath.includes('models/') || relPath.includes('schemas/')) {
      moduleName = 'db';
    }
    
    // Extract basic information from the file
    const lines = content.split('\n');
    const hasExports = content.includes('export ');
    const hasDefaultExport = content.includes('export default');
    
    // Create file description with metadata
    const fileType = getFileTypeDescription(fileExt);
    const fileDescription = extractJsDoc(lines) || `${fileName} - ${fileType}`;
    const fileDetails = `\n\n**File Details:**\n- Type: ${fileType}\n- Lines: ${lines.length}\n- Size: ${(stats.size / 1024).toFixed(2)} KB\n- Extension: ${fileExt.replace('.', '').toUpperCase()}\n- Exports: ${hasExports ? 'Yes' : 'No'}\n- Default Export: ${hasDefaultExport ? 'Yes' : 'No'}`;
    const description = fileDescription + fileDetails;
    
    // Determine component type based on file extension and content
    let componentType: 'component' | 'hook' | 'context' | 'utility' | 'type' | 'service' = 'utility';
    
    if (fileExt === '.tsx' || fileExt === '.jsx') {
      componentType = 'component';
    } else if (fileName.endsWith('.hook.ts') || fileName.endsWith('.hook.js')) {
      componentType = 'hook';
    } else if (fileName.endsWith('.context.ts') || fileName.endsWith('.context.js')) {
      componentType = 'context';
    } else if (fileName.endsWith('.service.ts') || fileName.endsWith('.service.js')) {
      componentType = 'service';
    } else if (fileName.endsWith('.types.ts') || fileName.endsWith('.types.js') || 
               fileName.endsWith('.d.ts')) {
      componentType = 'type';
    }
    
    // Extract functions, classes, and other code elements
    const methods = extractFunctions(content);
    
    // Create a component for the file
    // Add the component with all extracted information
    generator.addComponent(moduleName, {
      type: componentType,
      name: path.basename(fileName, path.extname(fileName)),
      description: description,
      status: 'documented',
      last_updated: stats.mtime.toISOString(),
      file: relPath,
      methods: methods,
      version_added: '0.1.0',
      documentation_status: hasExports ? 'draft' : 'reviewed',
      coverage: calculateCoverage(content, methods.length),
      // Add file metadata as keywords for better searchability
      keywords: [
        `lines:${lines.length}`,
        `size:${(stats.size / 1024).toFixed(2)}KB`,
        `type:${fileExt.replace('.', '').toUpperCase()}`,
        ...(hasExports ? ['exports'] : []),
        ...(hasDefaultExport ? ['default-export'] : [])
      ]
    });
    
  } catch (error: any) {
    console.warn(`Could not process ${filePath}:`, error.message);
  }
}

// Get a human-readable description for a file type
function getFileTypeDescription(ext: string): string {
  const descriptions: Record<string, string> = {
    '.ts': 'TypeScript source file',
    '.tsx': 'TypeScript React component',
    '.js': 'JavaScript source file',
    '.jsx': 'JavaScript React component',
    '.json': 'JSON data file',
    '.md': 'Markdown documentation',
    '.test.ts': 'TypeScript test file',
    '.test.js': 'JavaScript test file',
    '.spec.ts': 'TypeScript test specification',
    '.spec.js': 'JavaScript test specification'
  };
  
  return descriptions[ext] || 'Source code file';
}

// Calculate a simple documentation coverage score (0-1)
function calculateCoverage(content: string, methodCount: number): number {
  // This is a simplified calculation - in a real implementation, you'd want to:
  // 1. Count documented vs. undocumented functions/classes
  // 2. Check for JSDoc comments
  // 3. Consider other documentation factors
  
  if (content.includes('@module') || content.includes('@file')) {
    return 0.8; // High coverage if module/file is documented
  }
  
  if (content.includes('*/')) {
    return 0.5; // Medium coverage if there are any JSDoc comments
  }
  
  return methodCount > 0 ? 0.3 : 0.1; // Low coverage based on method count
}

// Extract JSDoc comments from the beginning of a file
function extractJsDoc(lines: string[]): string | undefined {
  let jsdoc = '';
  let inJsDoc = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('/**')) {
      inJsDoc = true;
      continue;
    }
    
    if (inJsDoc) {
      if (trimmed.endsWith('*/')) {
        inJsDoc = false;
        break;
      }
      
      // Clean up the JSDoc line
      const cleanLine = trimmed
        .replace(/^\s*\*\s?/, '') // Remove leading * and spaces
        .replace(/^@.*$/, '')       // Remove @tags
        .trim();
      
      if (cleanLine) {
        jsdoc += cleanLine + ' ';
      }
    } else if (trimmed) {
      // Stop at the first non-empty line that's not part of JSDoc
      break;
    }
  }
  
  return jsdoc.trim() || undefined;
}

// Extract function information from source code (simplified example)
function extractFunctions(content: string): Method[] {
  const functions: Method[] = [];
  
  // This is a simplified regex-based approach
  // In a real implementation, you would use the TypeScript compiler API
  const functionRegex = /(?:function\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)|const\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:\(([^)]*)\)|([a-zA-Z_$][\w$]*))\s*=>)/g;
  
  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    const name = match[1] || match[3];
    const params: Param[] = (match[2] || match[4] || '')
      .split(',')
      .map(p => p.trim())
      .filter(Boolean)
      .map(paramStr => {
        const [paramName, paramType] = paramStr.split(':').map(s => s.trim());
        return {
          name: paramName,
          type: paramType || 'any',
          description: '',
          required: !paramStr.includes('?')
        };
      });
    
    if (name) {
      functions.push({
        name,
        description: `Function ${name}`,
        parameters: params,
        returns: {
          type: 'void',
          description: ''
        },
        examples: []
      });
    }
  }
  
  return functions;
}

// Process Rust target (placeholder)
async function processRustTarget(generator: DocumentationGenerator, targetPath: string) {
  console.log('Processing Rust target...');
  // TODO: Implement Rust target processing
  // This would involve using the Rust extractor we integrated earlier
}

// Process Python target (placeholder)
async function processPythonTarget(generator: DocumentationGenerator, targetPath: string) {
  console.log('Processing Python target...');
  // TODO: Implement Python target processing
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
