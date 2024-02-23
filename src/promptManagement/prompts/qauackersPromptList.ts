import { PromptList } from "../Prompts.dt";

export const qauackersPromptList: PromptList = new PromptList([
    { IDENTIFY_HTML: "Examine the provided Angular HTML template and strategically insert data-testid attributes into interactive elements, prioritizing them as follows: buttons, dropdowns, text inputs, and labels. Consider the dynamic nature of the Angular elements to ensure the data-testid attributes remain reliable. For naming, use the action or descriptor followed by the element type (e.g., 'saveButton', 'emailInput', 'statusLabel'). After each modification. The goal is to enhance the HTML's testability for Playwright end-to-end testing while maintaining clarity and functionality." }
]);


