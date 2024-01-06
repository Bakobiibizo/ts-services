import { Manager } from './Manager.dt';
import { QAuackersAgent } from './agentManagement/agents/QAuackers';
import { BeeAgent } from "./agentManagement/agents/BeeAgent";
import OllamaRequestGenerator from './generatorManagement/agentArtificial/OllamaRequestGenerator'
import { OpenAIGenerator } from './generatorManagement/openaiAPI/OAIGenerator';
import { AnthropicGenerator } from './generatorManagement/anthropic/anthropicGenerator';

export const AgentManager = new Manager([QAuackersAgent, BeeAgent], [OllamaRequestGenerator, OpenAIGenerator, AnthropicGenerator])