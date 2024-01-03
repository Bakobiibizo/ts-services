import { GenericList } from "../commonTypes.dt"
import { PromptList, PromptListItem } from "../promptManagement/promptManager.dt"

export type VariableListItem = {
    [key: string]: any
}

export class VariablesList extends GenericList<VariableListItem> {
    constructor(variables: VariableListItem) {
        super();
        for (const [key, value] of Object.entries(variables)) {
            this.addItem({ [key]: value });
        }
    }
}


export class Agent {
    name: string
    description: string
    promptList: PromptList
    variablesList: VariableListItem[]
    constructor(name: string, description: string, promptList: PromptList, variablesList: [VariableListItem]) {
        this.name = name
        this.description = description
        this.promptList = promptList
        this.variablesList = variablesList
    }
}


export class AgentList extends GenericList<Agent> {
    constructor(agents: Agent[]) {
        super();
        for (const agent of agents) {
            this.addItem(agent);
        }
    }
}

