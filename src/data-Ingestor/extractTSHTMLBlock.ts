import * as ts from 'typescript'
import * as fs from 'fs';


export function extractTSHtmlBlock(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest).text;
}
