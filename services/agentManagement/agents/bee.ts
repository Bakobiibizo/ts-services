import { PromptList } from "../../promptManagement/promptManager.dt";
import { BeePromptList } from "../../promptManagement/prompts/beePrompt";
import { VariablesList, AgentList, Agent } from '../agentManager.dt';

const name = "Bee"

export class BeeAgent implements Agent {
  constructor() {
    this.name = beeVariableList[0]
    this.description =
      this.pomptList = BeePromptList
    this.variablesList = BeeVariableList

  }
}
export default BeeAgent