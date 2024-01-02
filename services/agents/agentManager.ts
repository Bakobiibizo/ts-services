import { Agent, Manager } from './agentManager.dt';

export class AgentManager implements Manager {
    agentList: Agent[];

    constructor(agents: Agent[]) {
        this.agentList = agents;
    }

    add()

    add(agent: Agent): string
    get(): [Agent]
    update(agent: Agent): string
    remove(agent: Agent): string
}
