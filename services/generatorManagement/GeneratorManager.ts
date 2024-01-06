import { OpenAIGenerator } from "./openaiAPI/assistants";
import AnthropicGenerator from "./anthropic/anthropicGenerator";
import OllamaRequestGenerator from "./agentArtificial/OllamaRequestGenerator";
import { GeneratorList } from "./Generator.dt";

export const GeneratorManager = new GeneratorList([OpenAIGenerator, AnthropicGenerator, OllamaRequestGenerator])