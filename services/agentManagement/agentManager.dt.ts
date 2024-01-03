import { GenericList } from "../commonTypes.dt"
import { PromptList } from "../promptManagement/promptManager.dt"

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
export type Agent = {
    name: string
    description: string
    promptList: PromptList
    variablesList: VariablesList
}

export class AgentList extends GenericList<Agent> {
    constructor(agent: Agent) {
        super();
        this.addItem(agent);
    }
}