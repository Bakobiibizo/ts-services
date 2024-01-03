import { Agent, AgentList } from './agentManager.dt';


export class AgentManager extends AgentList {
    agentList: AgentList
    constructor(agents: Agent[]) {
        super(agents);
        this.agentList = new AgentList(agents);
    }
}
export const agentManager = new AgentManager([]);


