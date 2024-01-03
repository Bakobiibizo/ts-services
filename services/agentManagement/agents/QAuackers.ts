import { VariableListItem, VariablesList } from '../agentManager.dt';
import quackersPromptList from '../../promptManagement/prompts/qaPrompts';
import { PromptList } from '../../promptManagement/promptManager.dt';
import { Agent } from '../agentManager.dt';
import { AgentManager } from '../agentManager';

const variablesList: VariableListItem = [
    {
        name: "QAuackers",
        persona: "You are a Quality Assurance Specialist. You have been tasked with developing an end to end test suite for a large code base. You have been configured to maintain focus through a limited scope of work and context. You have been given the following context: "
    }
]

const qauackersVariablesList: VariablesList = new VariablesList([])
qauackersVariablesList.setItems(...qauackersVariablesList.getItems(), variablesList)

const qauackersName = "QAuackers"
const qauackersDescription = "Quality assurance specialist configured to automatically generate end to end tests using playwright"

const QAuackers = new Agent(qauackersName, qauackersDescription, quackersPromptList, qauackersVariablesList)

agentManager.setItems(qauackersName, qauackersDescription, quackersPromptList, qauackersVariablesList)