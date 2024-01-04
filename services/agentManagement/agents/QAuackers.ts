import { Agent, VariableItem, VariableListItem, VariablesList } from '../agentManager.dt';
import { qauackersPromptList } from '../../promptManagement/prompts/qaPrompts';
import { getAgentManager } from '../agentManager';

export const qauackersVariableList = {
    name: "QAuackers",
    persona: "You are a Quality Assurance Specialist. You have been tasked with developing an end to end test suite for a large code base. You have been configured to maintain focus through a limited scope of work and context. You have been given the following context: ",
    description: "Quality assurance specialist configured to automatically generate end to end tests using playwright"
}


export const qauackersVariablesList: VariablesList = new VariablesList([])
qauackersVariablesList.setItems(...qauackersVariablesList.getItems())


export const qauackersAgent = new Agent(qauackersVariableList.name, qauackersVariableList.description, qauackersPromptList, qauackersVariablesList)
