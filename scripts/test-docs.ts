import { DocumentationGenerator } from '../src/utils/documentation-generator.js';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '..', 'test-output');

async function runTest() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Initialize documentation generator
    const generator = new DocumentationGenerator({
      name: 'Test Project',
      description: 'A test project for documentation generator',
      version: '1.0.0',
      repository: 'https://github.com/example/test-project',
      documentation_status: 'draft',
      coverage: 0,
      last_updated: new Date().toISOString()
    });

    // Add a module
    generator.addModule({
      name: 'core',
      description: 'Core functionality',
      status: 'documented',
      version_added: '1.0.0',
      complexity: 'medium'
    });

    // Add a component
    generator.addComponent('core', {
      type: 'component',
      name: 'Button',
      description: 'A reusable button component',
      status: 'documented',
      last_updated: new Date().toISOString(),
      file: 'src/components/Button.tsx',
      props: [
        {
          name: 'onClick',
          type: '() => void',
          description: 'Click handler',
          required: true
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Button content',
          required: true
        },
        {
          name: 'variant',
          type: '"primary" | "secondary" | "danger"',
          description: 'Button style variant',
          required: false,
          default: '"primary"'
        },
        {
          name: 'size',
          type: '"small" | "medium" | "large"',
          description: 'Button size',
          required: false,
          default: '"medium"'
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Disable the button',
          required: false,
          default: 'false'
        }
      ],
      examples: [
        {
          title: 'Basic Usage',
          description: 'A simple button with a click handler',
          code: '// Example usage of Button component\n<Button onClick={() => console.log(\"Clicked!\")}>\n  Click me\n</Button>'
        },
        {
          title: 'Disabled State',
          description: 'A disabled button',
          code: '// Disabled button example\n<Button disabled>Disabled Button</Button>'
        }
      ]
    });

    // Generate and save documentation
    const docs = generator.generate();
    const outputPath = path.join(OUTPUT_DIR, 'test-docs.json');
    await fs.writeFile(outputPath, JSON.stringify(docs, null, 2));
    
    console.log(`✅ Test documentation generated at: ${outputPath}`);
    
    // Print a summary
    console.log('\nDocumentation Summary:');
    console.log(`- Project: ${docs.project.name} v${docs.project.version}`);
    console.log(`- Modules: ${docs.modules.length}`);
    console.log(`- Components: ${docs.modules.reduce((count, mod) => 
      count + (mod.components?.length || 0), 0)}`);
    
  } catch (error) {
    console.error('❌ Error generating test documentation:', error);
    process.exit(1);
  }
}

// Run the test
runTest();
