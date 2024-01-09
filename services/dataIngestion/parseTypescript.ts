import * as ts from 'typescript';
import * as fs from 'fs';

export function parseTypeScript(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
        filePath,
        fileContent,
        ts.ScriptTarget.Latest
    );

    let html = '';
    // Traverse the AST and process nodes as needed
    sourceFile.forEachChild(node => {
        if (ts.isClassDeclaration(node)) {
            html = node?.name?.text || ''
        }
    });
    return html

}

// Example usage
// processTypeScriptFile('path/to/angular/component.ts');
