import { Agent, AgentList } from './agentManager.dt';
import { PromptManager } from '../prompts/promptManager';
import {
    BEE_PERSONA,
    INVENTORY_COLLECTION,
    CREATING_ESTIMATE,
    FINAL_STAGE
} from '../prompts/prompts';

const promptManager = new PromptManager();
const bee: Agent = {
    name: "bee",
    description: "A sales assistant configured to help with scheduling and booking moves.",
    promptlist: [
        promptManager.getPrompt(BEE_PERSONA),
        promptManager.getPrompt(INVENTORY_COLLECTION),
        promptManager.getPrompt(CREATING_ESTIMATE),
        promptManager.getPrompt(FINAL_STAGE)
    ]
}

export class AgentManager {
    agentList: AgentList;
    constructor() {
        this.agentList = new AgentList(bee);
    }
}