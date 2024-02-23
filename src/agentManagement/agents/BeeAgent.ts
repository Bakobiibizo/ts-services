import { Agent } from "../Agents.dt";
import { beePromptList } from "../../promptManagement/prompts/beePromptList";
import { beeVariableList } from "../../variableManagement/variables/beeVariableList";

export const BeeAgent = new Agent(beeVariableList.getItem("name"), beeVariableList.getItem("description"), beePromptList, beeVariableList) 