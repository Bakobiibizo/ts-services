import { PromptListItem } from "../../promptManagement/promptManager.dt";
import quackersPromptList from "../../promptManagement/prompts/qaPrompts";
import { AgentManager } from "../agentManager";
import { Agent, VariableListItem } from '../agentManager.dt';

const name = "Bee"

export class BeeAgent extends AgentManager {
  name: string
  description: string
  promptList: PromptListItem[]
  variablesList: VariableListItem[]
  constructor(agents: Agent[]) {
    super([]);
    this.name = name
    this.description = ""
    this.promptList = []
    this.variablesList = []
    for (const agent of agents) {
      this.name = agent.name
      this.description = agent.description
      this.promptList = agent.promptList
      this.variablesList = agent.variablesList
    }
  }
}

export default BeeAgent