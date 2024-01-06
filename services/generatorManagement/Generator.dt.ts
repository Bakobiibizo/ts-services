import { HTTPClient } from './HTTPClient';
import { GenericList } from '../commonTypes.dt';
import OllamaRequestGenerator from './agentArtificial/OllamaRequestGenerator';
import { AnthropicGenerator } from './anthropic/anthropicGenerator';
import { OpenAIGenerator } from './openaiAPI/assistants';
import { OAIGenerator } from './openaiAPI/OAIGenerator';
import { OAIMessage } from './openaiAPI/OAIRequest.dt';

export class Generator {
    prompt: string;
    systemPrompt: string;
    contextWindow: OAIMessage[];
    url: string;
    fullResponse: any[];
    httpClient: HTTPClient;
    constructor() {
        this.prompt = "";
        this.systemPrompt = '';
        this.contextWindow = [];
        this.url = '';
        this.fullResponse = [];
        this.httpClient = new HTTPClient('');
    }
    setPrompt(prompt: string, role: string = "user") {
        this.prompt = prompt;
        this.contextWindow.push(new OAIMessage(role, prompt))
    }
    setSystemPrompt(systemPrompt: string) {
        this.contextWindow.shift();
        this.systemPrompt = systemPrompt;
        this.contextWindow.unshift({ role: "system", content: systemPrompt })
    }
    setContextWindow() {
        this.contextWindow = [];
        this.setSystemPrompt(this.systemPrompt);
        this.setPrompt(this.prompt)
    }
    setUrl(url: string) {
        this.url = url;
        this.httpClient = new HTTPClient(this.url);
    }
    setHttpClient(httpClient: any) {
        this.httpClient = httpClient;
    }
    async generateData() {
        try {
            const response = await this.httpClient.post('', { prompt: this.contextWindow });
            response.data.on('data', (chunk: any) => {
                this.fullResponse.push(chunk);
            });
            response.data.on('end', () => {
                const output = Buffer.concat(this.fullResponse).toString();
                console.log(output);
            });
        } catch (error) {
            console.error('Error during generateData:', error);
        }
    }
}
export class GeneratorList extends GenericList<Generator> {
    constructor(generators: Generator[]) {
        super();
        this.setItems(...generators);
    }
}

export const generatorList = new GeneratorList([
    OllamaRequestGenerator, OAIGenerator, AnthropicGenerator
])