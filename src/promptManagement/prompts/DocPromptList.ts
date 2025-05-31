import { PromptList } from '../Prompts.dt';

export const DocPromptList = new PromptList([

    {
        documentation: `
Task Overview:
Please rewrite the code block, appending an clear and detailed docstring. You should cover the script its self as well as every major function, class, or method. You should cover the purpose of the code, its inputs, outputs, and any significant behaviors or side effects. It is crucial to replicate the original code exactly as provided, without any modifications, as it is intended for production use. The accuracy of your documentation and the integrity of the code are paramount."
`
    }
])