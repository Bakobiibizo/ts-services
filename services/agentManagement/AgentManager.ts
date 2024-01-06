import { BeeAgent } from "./agents/BeeAgent";
import { QAuackersAgent } from "./agents/QAuackers";
import { AgentList } from './Agents.dt';

export const AgentManager = new AgentList([QAuackersAgent, BeeAgent])