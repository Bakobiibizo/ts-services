import { Agent } from "../Agents.dt";
import { DocPromptList } from "../../promptManagement/prompts/DocPromptList";
import { DocVariableList } from "../../variableManagement/variables/DocVariablesList";
const variables = DocVariableList
const prompts = DocPromptList

//console.log(variables)
//console.log(prompts)

const name = variables.getItems()[0]["name"]
const description = variables.getItems()[1]["description"]
//console.log(name, description)


export const docAgent = new Agent(name, description, prompts, variables)
