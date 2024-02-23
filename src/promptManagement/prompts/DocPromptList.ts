import { PromptList } from '../Prompts.dt';

export const DocPromptList = new PromptList([

    {
        documentation: `
Task Overview:
Please rewrite the code block, appending an elaborate docstring at the beginning. This docstring should cover the purpose of the code, its inputs, outputs, and any significant behaviors or side effects. It is crucial to replicate the original code exactly as provided, without any modifications, as it is intended for production use. The accuracy of your documentation and the integrity of the code are paramount."
`
    }
])