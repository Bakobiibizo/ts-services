import { GenericList } from "../commonTypes.dt"

export type PromptListItem = {
    [key: string]: any
}

export class PromptList extends GenericList<PromptListItem> {
    constructor(prompt: PromptListItem[]) {
        super();
        this.addItem(prompt);
    }
}