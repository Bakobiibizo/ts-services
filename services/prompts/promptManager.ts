import {
    BEE_PERSONA,
    GENERAL_COLLECTION,
    INVENTORY_COLLECTION,
    CREATING_ESTIMATE,
    FINAL_STAGE
} from './prompts'

export type PromptListItem = {
    "name": string,
    "prompt": string
}

export type Manager = {
    promptList: PromptListItem[]

    addPrompt(promptName: string, prompt: string): string
    getPromptList(): PromptListItem[]
    updatePrompt(promptName: string, newPrompt: string): string
    removePrompt(promptName: string): string

}

export default class PromptManager implements Manager {
    promptList: PromptListItem[] = []
    constructor() {
        this.promptList = [
            { name: 'bee', prompt: BEE_PERSONA },
            { name: 'generalCollection', prompt: GENERAL_COLLECTION },
            { name: 'inventoryCollection', prompt: INVENTORY_COLLECTION },
            { name: 'creatingEstimate', prompt: CREATING_ESTIMATE },
            { name: ', FINAL_STAGE: ', prompt: FINAL_STAGE }
        ]
    }

    addPrompt(promptName: string, prompt: string): string {
        this.promptList.push({
            "name": promptName,
            "prompt": prompt
        })
        return "prompt added"
    }
    getPromptList(): PromptListItem[] {
        return this.promptList
    }
    updatePrompt(promptName: string, newPrompt: string): string {
        this.promptList.map((item) => {
            if (item.name === promptName) {
                item.prompt = newPrompt
                return "prompt updated"
            }
            return "prompt not found"
        })
    }
    removePrompt(promptName: string): string {
        this.promptList.filter((item) => {
            item.prompt !== promptName
            return "prompt removed"
        })
    }
}

