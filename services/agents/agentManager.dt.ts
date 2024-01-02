import { GenericList } from "../commonTypes.dt"
import { PromptListItem } from "../prompts/promptManager.dt"

export type Agent = {
    name: string
    description: string
    promptlist: PromptListItem[] | string[]
}

export class AgentList extends GenericList<Agent> {
    agentList: Agent[];

    constructor(agent: Agent) {
        super();
        this.agentList = [];
        this.addItem(agent);
    }

}