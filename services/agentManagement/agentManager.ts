import { Agent, AgentList } from './agentManager.dt';
import BeeAgent from './agents/bee';
import QuackersAgent from './agents/quackers';
import { AnthropicDataGenerator } from '../testDataGenerator/generationPrompts';


class AgentManager {
    agentList: AgentList;
    constructor(agent: Agent) {
        this.agentList = new AgentList(agent);
    }
}

const agentManager = new AgentManager(new BeeAgent());


agentManager.agentList.addItem(BeeAgent)
agentManager.agentList.addItem(QuackersAgent)
export default agentManager;