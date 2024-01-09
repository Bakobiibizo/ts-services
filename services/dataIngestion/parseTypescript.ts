import * as ts from 'typescript';
import * as fs from 'fs';
import { extractHtml } from './extractHtml';
import * as path from 'path';

function parseTypeScript(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest);
    return sourceFile;
}
function findComponentDecorator(sourceFile: ts.SourceFile, filePath: string, decorators: ts.NodeArray<ts.Decorator>) {
    let templateContent: string | undefined;
    for (const decorator of decorators) {
        const callExpression = decorator.expression;
        if (ts.isCallExpression(callExpression) && callExpression.expression.getText(sourceFile) === 'Component') {
            const argument = callExpression.arguments[0];
            if (ts.isObjectLiteralExpression(argument)) {
                argument.properties.forEach(prop => {
                    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === 'templateUrl' && ts.isStringLiteral(prop.initializer)) {
                        const templateUrl = prop.initializer.text;
                        const dir = path.dirname(filePath);
                        const htmlFilePath = path.join(dir, templateUrl);
                        templateContent = extractHtml(htmlFilePath);
                    }
                });
            }
        }
    }
    return templateContent;
}
const filePath = 'D:/01AgentArtificial/angular-frontend/src/app/app.component.html';
const sourceFile = parseTypeScript(filePath);
const decorators = sourceFile.statements.forEach(statement => {
    let hmtlArray = []
    let templateContent: string[] = [];
    if (ts.isClassDeclaration(statement)) {
        const components = statement.members.filter(decorators => ts.isDecorator(decorators) && ts.isCallExpression(decorators.expression) && ts.isIdentifier(decorators.expression.expression) && decorators.expression.expression.getText(sourceFile) === 'Component')
        if (components.length > 0) {
            components.forEach(component => {
                component.forEachChild(child => {
                    if (ts.isDecorator(child)) {
                        const callExpression = child.expression;
                        if (ts.isCallExpression(callExpression) && callExpression.expression.getText(sourceFile) === 'Component') {
                            const argument = callExpression.arguments[0];
                            if (ts.isObjectLiteralExpression(argument)) {
                                argument.properties.forEach(prop => {
                                    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === 'templateUrl' && ts.isStringLiteral(prop.initializer)) {
                                        const templateUrl = prop.initializer.text;
                                        const dir = path.dirname(filePath);
                                        const htmlFilePath = path.join(dir, templateUrl);
                                        templateContent.join(extractHtml(htmlFilePath));
                                    }

                                });

                            }

                        }

                    }

                })

            })

        }

    }

});