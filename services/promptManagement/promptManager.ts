import { PromptListItem, PromptList } from './promptManager.dt';
import { GenericList } from "../commonTypes.dt";
import { qauackersPromptList } from './prompts/qaPrompts';
import { beePromptList } from "./prompts/beePrompt";

class PromptManager {
    promptList: PromptList;

    constructor() {
        this.promptList = new PromptList([]);
    }
    addPrompt(promptName: string, prompt: string): string {
        this.promptList.addItem({ name: promptName, prompt: prompt });
        return "prompt added";
    }
    addPromptList(promptList: PromptListItem[]) {
        this.promptList.setItems(...this.promptList.getItems(), ...promptList);
    }
    getPromptList(): GenericList<PromptListItem> {
        return this.promptList;
    }

    getPrompt(key: string): PromptListItem {
        return this.promptList.getItem(key);
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

const PromptListManager = new PromptManager();

PromptListManager.addPromptList([qauackersPromptList, beePromptList]);

export default PromptListManager