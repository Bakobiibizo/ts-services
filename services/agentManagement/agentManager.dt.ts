import { GenericList } from "../commonTypes.dt"
import { PromptListItem } from "../promptManager/promptManager.dt"



export type Agent = {
    name: string
    description: string
    promptlist: PromptListItem[]
}


export class AgentList extends GenericList<Agent> {
    agentList: Agent[];

    constructor(agent: Agent) {
        super();
        this.agentList = [];
        this.addItem(agent);
    }
}