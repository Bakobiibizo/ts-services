import { PromptListItem } from "./promptManager.dt"
import { GenericList } from "../commonTypes.dt";

import {
    BEE_PERSONA,
    INVENTORY_COLLECTION,
    CREATING_ESTIMATE,
    FINAL_STAGE
} from './prompts'

export class PromptManager {
    promptList: GenericList<PromptListItem>;

    constructor() {
        this.promptList = new GenericList<PromptListItem>();
        this.addPrompt("beePersona", BEE_PERSONA);
        this.addPrompt("inventoryCollection", INVENTORY_COLLECTION);
        this.addPrompt("creatingEstimate", CREATING_ESTIMATE);
        this.addPrompt("finalStage", FINAL_STAGE);
    }
    addPrompt(promptName: string, prompt: string): string {
        this.promptList.addItem({ name: promptName, prompt: prompt });
        return "prompt added";
    }
    getPromptList(): GenericList<PromptListItem> {
        return this.promptList;
    }

    getPrompt(promptName: string): string {
        const item = this.promptList.getItems().find((item) => item.name === promptName);
        if (item) {
            return item.prompt;
        }
        return "prompt not found";
    }
    updatePrompt(promptName: string, newPrompt: string): string {
        const item = this.promptList.getItems().find((item) => item.name === promptName);
        if (item) {
            item.prompt = this.updatePrompt(promptName, newPrompt);
            return "prompt updated";
        }
        return "prompt not found";
    }

    removePrompt(promptName: string): string {
        const initialLength = this.promptList.getItems().length;
        const promptList = this.promptList.getItems().filter((item) => item.name !== promptName);
        this.promptList.setItems(promptList);
        return this.promptList.getItems().length < initialLength ? "prompt removed" : "prompt not found";
    }
}
