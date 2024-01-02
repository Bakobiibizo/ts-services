
import {
    PromptListItem,
    BEE_PERSONA,
    ESTIMATE_INVENTORY_PROMPT,
    INVENTORY_COLLECTION_PROMPT,
    CREATING_ESTIMATE_PROMPT,
    FINAL_STAGE_PROMPT
} from "../promptManager/prompts/beePrompt"
const promptList = [
    BEE_PERSONA,
    ESTIMATE_INVENTORY_PROMPT,
    INVENTORY_COLLECTION_PROMPT,
    CREATING_ESTIMATE_PROMPT,
    FINAL_STAGE_PROMPT
]
const name = "bee"
const discription = "A sales assistant configured to help with scheduling and booking moves."

export const beeAgent = (name: string, discription: string, promptList: PromptListItem[]): PromptListItem => {
    return {
        name: name,
        discription: discription,
      : promptList
    }
  }