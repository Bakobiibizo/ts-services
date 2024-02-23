import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

// Function to read and extract function blocks from a TypeScript file
function extractTSHTMLBlock(filePath: string) {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Create a SourceFile object
    const sourceFile = ts.createSourceFile(
        path.basename(filePath),
        fileContent,
        ts.ScriptTarget.ESNext,
        true
    );
    const codeblocks: string[] = [];
    // Function to recursively traverse the AST
    function visit(node: ts.Node) {
        // Check if the node is a function (function declaration, method, or arrow function)
        if (
            ts.isFunctionDeclaration(node) ||
            ts.isMethodDeclaration(node) ||
            ts.isArrowFunction(node)
        ) {
            // Get the full text of the function from the source file
            const functionText = node.getFullText(sourceFile);
            codeblocks.push(functionText);
            console.log('Function Block:\n', functionText);
            console.log('-----------------------------------');
        }

        // Continue traversing the AST
        ts.forEachChild(node, visit);
    }

    // Start traversing the AST from the root node
    visit(sourceFile);
    return codeblocks
}


export default extractTSHTMLBlock

