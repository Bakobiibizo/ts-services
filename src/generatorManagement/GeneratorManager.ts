import { OpenAIGenerator } from "./openaiAPI/assistants";
import AnthropicGenerator from "./anthropic/anthropicGenerator";
import OllamaRequestGenerator from "./agentArtificial/OllamaRequestGenerator";
import { GeneratorList } from "./Generator.dt";

const GeneratorManager = new GeneratorList([])


export default GeneratorManager
