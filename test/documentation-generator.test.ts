const { DocumentationGenerator } = require('../src/utils/documentation-generator');
const fs = require('fs');
const path = require('path');

console.log('Running documentation generator test...');

// Initialize the generator
const generator = new DocumentationGenerator({
  name: 'Test Project',
  description: 'A test project for documentation generator',
  version: '1.0.0',
  repository: 'https://github.com/example/test-project'
});

// Add a module
generator.addModule({
  name: 'components',
  description: 'UI Components',
  status: 'documented',
  version_added: '1.0.0',
  complexity: 'medium'
});

// Add a component
generator.addComponent('components', {
  type: 'component',
  name: 'Button',
  description: 'A reusable button component',
  status: 'documented',
  last_updated: new Date().toISOString(),
  file: 'src/components/Button.tsx',
  props: [
    DocumentationGenerator.createProp({
      name: 'variant',
      type: '\'primary\' | \'secondary\' | \'danger\'',
      description: 'The visual style of the button',
      default: '\'primary\''
    }, false),
    DocumentationGenerator.createProp({
      name: 'onClick',
      type: '() => void',
      description: 'Click handler',
      required: true
    })
  ],
  examples: [
    {
      title: 'Basic Usage',
      code: '<Button onClick={() => {}}>Click me</Button>',
      description: 'A simple button with a click handler'
    }
  ]
});

// Generate the documentation
const docs = generator.generate();

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Save the documentation
const outputPath = path.join(outputDir, 'test-docs.json');
fs.writeFileSync(outputPath, JSON.stringify(docs, null, 2));

console.log('✅ Documentation generated successfully!');
console.log(`📄 Output file: ${outputPath}`);

// Basic assertions
if (!docs.project) {
  console.error('❌ Missing project metadata');
  process.exit(1);
}

if (!Array.isArray(docs.modules) || docs.modules.length === 0) {
  console.error('❌ No modules found');
  process.exit(1);
}

console.log('✅ All tests passed!');
