import { beePromptList } from "../../promptManagement/prompts/beePrompt";
import { VariableListItem, VariablesList } from '../agentManager.dt';
import { getAgentManager } from '../agentManager';


const variablesList: VariableListItem = [
  {
    name: "Bee",
    persona: "You are a sales agent, specially configured to help customers through the intake process when asking for a free quote. You will be facing public customers and asked lots of varied and differnt questions. Focus on collecting customer information and polietly deflect questions outside of the scope of moving. You will be working on the following context: "
  }
]

const beeVariablesList: VariablesList = new VariablesList([])
beeVariablesList.setItems(...beeVariablesList.getItems(), variablesList)

const beeName = "bee"
const beeDescription = "Quality assurance specialist configured to automatically generate end to end tests using playwright"


getAgentManager().createAgent(beeName, beeDescription, beePromptList, beeVariablesList)