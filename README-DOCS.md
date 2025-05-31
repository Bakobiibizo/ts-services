# Documentation Generator

This tool generates documentation for various programming languages by analyzing source code and creating structured documentation in a consistent format.

## Features

- Generate documentation for TypeScript/JavaScript, Python, and Rust code
- Create a structured JSON output following a consistent schema
- Support for multiple programming languages
- Extensible architecture for adding more language support

## Installation

```bash
npm install
```

## Usage

### Generate Documentation for Test Targets

To generate documentation for all test targets:

```bash
npm run docs:generate
```

This will process all targets in the `test_targets` directory and generate documentation in the `docs-output` directory.

### Build and Generate Documentation

To compile the TypeScript code and then generate documentation:

```bash
npm run docs:build
```

### Command Line Usage

You can also use the CLI tool directly:

```bash
npx ts-node scripts/process-test-targets.ts
```

## Output Format

The generated documentation follows this structure:

```typescript
{
  project: {
    name: string;
    description: string;
    version: string;
    repository: string;
    // ... other metadata
  };
  modules: Array<{
    name: string;
    description: string;
    components: Array<{
      type: string;
      name: string;
      description: string;
      // ... component details
    }>;
    // ... other module properties
  }>;
  // ... other documentation properties
}
```

## Adding Support for New Languages

1. Create a new processor function in `scripts/process-test-targets.ts`
2. Add a case in the `processTarget` function to handle the new language
3. Implement the extraction logic for the new language

## License

[MIT](LICENSE)
