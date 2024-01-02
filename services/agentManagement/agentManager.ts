import { Agent, AgentList } from './agentManager.dt';
import {
    IDENTIFY_HTML_PROMPT
} from '../promptManager/prompts/qaPrompts';


export const qauckers: Agent = {
    name: "qauckers",
    description: "A Quality Assurance agent configured to automate playwrite testing.",
    promptlist: [
        promptManager.getPrompt(IDENTIFY_HTML_PROMPT)
    ]
}
class AgentManager {
    agentList: AgentList;
    constructor() {
        this.agentList = new AgentList(bee);
        this.agentList.addItem(qauckers);
    }
}

const agentManger = new AgentManager();
export const agentManger