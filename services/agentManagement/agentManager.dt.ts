import { GenericList } from "../commonTypes.dt"
import { PromptList } from "../promptManagement/promptManager.dt"

export type VariableListItem = {
    [key: string]: any
}

export class VariablesList extends GenericList<VariableListItem> {
    variablesList: VariablesList
    constructor(variables: VariableListItem[]) {
        super();
        this.variablesList = new VariablesList(variables);
        for (const variable of variables) {
            this.addItem(variable);
        }
    }
}



export class Agent {
    name: string
    description: string
    promptList: PromptList
    variablesList: VariablesList
    constructor(name: string, description: string, promptList: PromptList, variablesList: VariablesList) {
        this.name = name
        this.description = description
        this.promptList = promptList
        this.variablesList = variablesList
    }
}


export class AgentList extends GenericList<Agent> {
    constructor(agents: Agent[]) {
        super();
        agents.forEach((agent) => {
            this.addItem(agent);
        })
    }
}

