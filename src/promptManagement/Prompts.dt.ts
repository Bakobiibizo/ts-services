import { GenericList } from "../commonTypes.dt"

export type PromptListItem = {
    [key: string]: any
}

export class PromptList extends GenericList<PromptListItem>{
    constructor(prompts: PromptListItem[]) {
        super();
        this.setItems(...prompts)
    }
}