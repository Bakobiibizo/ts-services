import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

export function extractJSX(code: string) {
    const jsxElements: string[] = [];
    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: [
            'jsx',
            'typescript'
        ]
    });

    traverse(ast, {
        JSXElement(path) {
            // Convert the JSX element to string
            const jsxString = generate(path.node).code;
            jsxElements.push(jsxString);
        }
    });
    return jsxElements.join('\n')
}
