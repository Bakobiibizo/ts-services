import { BeeAgent } from "./agents/BeeAgent";
import { qauackers } from "./agents/QAuackers";
import { docAgent } from "./agents/DocAgent";
import { AgentList } from './Agents.dt';

export const AgentManager = new AgentList([qauackers, BeeAgent, docAgent])