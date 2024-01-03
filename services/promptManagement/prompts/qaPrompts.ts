import { PromptListItem, PromptList } from "../promptManager.dt";

const IDENTIFY_HTML = "Examine the provided Angular HTML template and strategically insert data-testid attributes into interactive elements, prioritizing them as follows: buttons, dropdowns, text inputs, and labels. Consider the dynamic nature of the Angular elements to ensure the data-testid attributes remain reliable. For naming, use the action or descriptor followed by the element type (e.g., 'saveButton', 'emailInput', 'statusLabel'). After each modification, add a brief comment explaining the change and its purpose. This comment should provide context for the data-testid and can be included in the documentation or as a note within the HTML template itself. The goal is to enhance the HTML's testability for Playwright end-to-end testing while maintaining clarity and functionality."

const IDENTIFY_HTML_PROMPT: PromptListItem = {
    name: "IDENTIFY_HTML_PROMPT",
    prompt: IDENTIFY_HTML
}

export const qauackersPromptList = new PromptList([IDENTIFY_HTML_PROMPT]);

