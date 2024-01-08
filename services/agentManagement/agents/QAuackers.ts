import { Agent } from "../Agents.dt";
import { qauackersPromptList } from "../../promptManagement/prompts/qauackersPromptList";
import { qauackersVariableList } from "../../variableManagement/variables/QAuackers";

const variables = qauackersVariableList
const prompts = qauackersPromptList

//console.log(variables)
//console.log(prompts)

const name = variables.getItems()[0]["name"]
const description = variables.getItems()[1]["description"]

//console.log(name, description)


export const qauackers = new Agent(name, description, prompts, variables)
