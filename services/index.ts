import { AgentManager, Agent } from "./agentManagement/agentManager";
import { IDENTIFY_HTML_PROMPT } from "./promptManager/prompts/qaPrompts";

export const agentManager = new AgentManager();



const quackers: Agent = agentManager.agentList.getItem("quackers")