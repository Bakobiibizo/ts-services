import * as fs from 'fs/promises';
import * as path from 'path';
import * as url from 'url';
import { OllamaRequestGenerator } from './generatorManagement/agentArtificial/OllamaRequestGenerator';
import { AgentManager } from './agentManagement/AgentManager';

export interface CodeBlock {
  type: 'function' | 'class' | 'interface' | 'variable' | 'type' | 'unknown';
  name: string;
  content: string;
  startLine: number;
  endLine: number;
  description?: string;
}

export class CodeDocumenter {
  private ollama: OllamaRequestGenerator;
  private model: string;
  private baseDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.ollama = new OllamaRequestGenerator();
    this.model = process.env.MODEL || 'llama4';
    this.baseDir = baseDir;
    
    // Configure Ollama with documentation-specific settings
    this.ollama.setModel(this.model);
    this.ollama.setSystemPrompt(AgentManager.getItems()[2].variableList.getItems()[2]["persona"]);
  }

  /**
   * Parse a source file into logical code blocks
   */
  async parseFile(filePath: string): Promise<CodeBlock[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const blocks: CodeBlock[] = [];
    
    // This is a simplified parser - in a real implementation, you'd want to use
    // a proper parser for each language (TypeScript, Python, Rust, etc.)
    let currentBlock: Partial<CodeBlock> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect function declarations (simplified)
      const functionMatch = line.match(/(?:function|const|let|var|export\s+)?\s*([a-zA-Z_$][\w$]*)\s*[=:].*=>|function\s+([a-zA-Z_$][\w$]*)\s*\(/);
      // Detect class declarations
      const classMatch = line.match(/class\s+([a-zA-Z_$][\w$]*)/);
      // Detect interface/type declarations (TypeScript)
      const typeMatch = line.match(/(?:interface|type)\s+([a-zA-Z_$][\w$]*)/);
      
      // If we find the start of a new block and we're not already in one
      if ((functionMatch || classMatch || typeMatch) && !currentBlock) {
        const name = (functionMatch?.[1] || functionMatch?.[2] || classMatch?.[1] || typeMatch?.[1])!;
        const type = classMatch ? 'class' : 
                    typeMatch ? (line.includes('interface') ? 'interface' : 'type') : 
                    'function';
        
        currentBlock = {
          type,
          name,
          content: line,
          startLine: i + 1
        };
      } 
      // If we're in a block, add the current line to it
      else if (currentBlock) {
        currentBlock.content += '\n' + line;
        
        // Check for the end of the block (simplified)
        if (line.trim() === '}' || line.trim() === '};' || line.trim() === '' && i > currentBlock.startLine! + 5) {
          currentBlock.endLine = i + 1;
          blocks.push(currentBlock as CodeBlock);
          currentBlock = null;
        }
      }
    }
    
    // Add the last block if file ends without a closing brace
    if (currentBlock) {
      currentBlock.endLine = lines.length;
      blocks.push(currentBlock as CodeBlock);
    }
    
    return blocks;
  }

  /**
   * Generate documentation for a code block using Ollama
   */
  async documentBlock(block: CodeBlock): Promise<string> {
    try {
      // Construct the prompt for documentation
      const prompt = `Please document the following ${block.type} "${block.name}":\n\n${block.content}\n\n` +
                   `Provide a clear and concise description of what this ${block.type} does, its parameters, ` +
                   `return values, and any important implementation details.`;
      
      // Make the request to Ollama
      this.ollama.setPrompt(prompt, "user");
      const request = this.ollama.constructFullPrompt(prompt, this.model);
      
      // Process the streaming response
      let fullResponse = '';
      const response = await this.ollama.makeRequest(request);
      
      if (response?.data) {
        const lines = response.data.split('\n');
        for (const line of lines) {
          try {
            if (line.trim()) {
              const json = JSON.parse(line);
              fullResponse += json.response || '';
            }
          } catch (e) {
            console.error('Error parsing Ollama response line:', e);
          }
        }
      }
      
      return fullResponse.trim();
    } catch (error) {
      console.error(`Error documenting block ${block.name}:`, error);
      return `/* Error generating documentation: ${error.message} */`;
    }
  }

  /**
   * Document an entire file by parsing it into blocks and documenting each one
   */
  async documentFile(filePath: string): Promise<{file: string, blocks: CodeBlock[]}> {
    try {
      const relativePath = path.relative(this.baseDir, filePath);
      console.log(`Documenting file: ${relativePath}`);
      
      const blocks = await this.parseFile(filePath);
      
      // Document each block in sequence
      for (const block of blocks) {
        console.log(`  Documenting ${block.type}: ${block.name}`);
        block.description = await this.documentBlock(block);
      }
      
      return { file: relativePath, blocks };
    } catch (error) {
      console.error(`Error documenting file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Generate documentation for all files in a directory
   */
  async documentDirectory(dirPath: string): Promise<Record<string, CodeBlock[]>> {
    const results: Record<string, CodeBlock[]> = {};
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively process subdirectories
          const subResults = await this.documentDirectory(fullPath);
          Object.assign(results, subResults);
        } else if (this.isSupportedFile(entry.name)) {
          // Process supported source files
          try {
            const { file, blocks } = await this.documentFile(fullPath);
            results[file] = blocks;
          } catch (error) {
            console.error(`Skipping file due to error: ${fullPath}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
    
    return results;
  }

  /**
   * Check if a file is a supported source file
   */
  private isSupportedFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ['.ts', '.tsx', '.js', '.jsx', '.py', '.rs'].includes(ext);
  }

  /**
   * Format documentation results as markdown
   */
  static formatAsMarkdown(results: Record<string, CodeBlock[]>): string {
    let markdown = '# Code Documentation\n\n';
    
    for (const [file, blocks] of Object.entries(results)) {
      if (blocks.length === 0) continue;
      
      markdown += `## ${file}\n\n`;
      
      for (const block of blocks) {
        markdown += `### ${block.type.charAt(0).toUpperCase() + block.type.slice(1)}: ${block.name}\n\n`;
        markdown += `${block.description || '*No documentation generated*'}\n\n`;
        markdown += '```' + this.getLanguageForBlock(block) + '\n';
        markdown += block.content + '\n';
        markdown += '```\n\n';
      }
    }
    
    return markdown;
  }
  
  /**
   * Get the markdown language identifier for a code block
   */
  private static getLanguageForBlock(block: CodeBlock): string {
    switch (block.type) {
      case 'class':
      case 'function':
      case 'variable':
      case 'type':
      case 'interface':
        return 'typescript';
      default:
        return 'javascript';
    }
  }
}

// Example usage
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  const [,, ...args] = process.argv;
  const targetPath = args[0] || '.';
  
  const documenter = new CodeDocumenter();
  const absolutePath = path.resolve(targetPath);
  
  (async () => {
    try {
      const stats = await fs.stat(absolutePath);
      
      if (stats.isDirectory()) {
        const results = await documenter.documentDirectory(absolutePath);
        const markdown = CodeDocumenter.formatAsMarkdown(results);
        console.log(markdown);
        
        // Optionally save to a file
        await fs.writeFile('DOCUMENTATION.md', markdown, 'utf-8');
        console.log('Documentation saved to DOCUMENTATION.md');
      } else if (stats.isFile()) {
        const { file, blocks } = await documenter.documentFile(absolutePath);
        const results = { [file]: blocks };
        const markdown = CodeDocumenter.formatAsMarkdown(results);
        console.log(markdown);
      }
    } catch (error) {
      console.error('Error generating documentation:', error);
      process.exit(1);
    }
  })();
}
