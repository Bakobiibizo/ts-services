import * as ts from 'typescript';
import * as fs from 'fs';


export function parseTypeScript(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest);
}

const parsed_script = parseTypeScript('tests/AgentArtificial.html')

console.log(parsed_script.text)