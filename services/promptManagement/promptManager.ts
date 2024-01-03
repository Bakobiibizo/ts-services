import { PromptListItem } from "./promptManager.dt"
import { GenericList } from "../commonTypes.dt";
import BeePromptList from "./prompts/beePrompt";
import quackersPromptList from "./prompts/qaPrompts";


class PromptManager {
    promptList: GenericList<PromptListItem>;

    constructor() {
        this.promptList = new GenericList<PromptListItem>();
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

PromptListManager.addPromptList(BeePromptList);
PromptListManager.addPromptList(quackersPromptList);


export default PromptListManager