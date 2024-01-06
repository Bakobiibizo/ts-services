import { Agent } from "../Agents.dt";
import { qauackersPromptList } from "../../promptManagement/prompts/qauackersPromptList";
import { qauackersVariableList } from "../../variableManagement/variables/QAuackers";

export const QAuackersAgent = new Agent(qauackersVariableList.getItem("name"), qauackersVariableList.getItem("description"), qauackersPromptList, qauackersVariableList)
