import { Agent, AgentList, VariablesList } from './agentManager.dt';
import { PromptList } from '../promptManagement/promptManager.dt';


export class AgentManager extends AgentList {
    constructor() {
        super([]);
    }
    createAgent(agentName: string, description: string, promptList: PromptList, variableList: VariablesList) {
        this.addItem(new Agent(agentName, description, promptList, variableList))
    }
}

const agentManager = new AgentManager()

export function getAgentManager() {
    return agentManager
}

