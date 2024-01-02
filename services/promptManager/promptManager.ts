import { PromptListItem } from "./promptManager.dt"
import { GenericList } from "../commonTypes.dt";

class PromptManager {
    promptList: GenericList<PromptListItem>;

    constructor() {
        this.promptList = new GenericList<PromptListItem>();
    }
    addPrompt(promptName: string, prompt: string): string {
        this.promptList.addItem({ name: promptName, prompt: prompt });
        return "prompt added";
    }
    getPromptList(): GenericList<PromptListItem> {
        return this.promptList;
    }

    getPrompt(item: PromptListItem): PromptListItem {
        return this.promptList.getItem(item);
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
        this.promptList.setItems(...promptList);
        return this.promptList.getItems().length < initialLength ? "prompt removed" : "prompt not found";
    }
}

const promptManager = new PromptManager();

export default promptManager