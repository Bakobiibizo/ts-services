import { PromptList } from '../promptManagement/Prompts.dt';
import { VariablesList } from '../variableManagement/Variables.dt';
import { GenericList } from '../commonTypes.dt';

export class Agent {
    name: string
    description: string
    promptList: PromptList
    variableList: VariablesList
    constructor(name: string, description: string, promptList: PromptList, variableList: VariablesList) {
        this.name = name
        this.description = description
        this.promptList = promptList
        this.variableList = variableList
    }
}

export class AgentList extends GenericList<Agent> {
    constructor(agents: Agent[]) {
        super();
        this.setItems(...agents)
    }
}

