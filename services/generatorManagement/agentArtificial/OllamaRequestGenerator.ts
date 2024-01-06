import { Generator } from '../Generator.dt';
import { HTTPClient } from '../HTTPClient';
import { OAIMessage } from '../openaiAPI/OAIRequest.dt';

class OllamaRequestGenerator extends Generator {
    prompt: string;
    systemPrompt: string;
    contextWindow: OAIMessage[];
    url: string;
    fullResponse: any[];
    httpClient: HTTPClient;

    constructor(systemPrompt: string, url: string) {
        super();
        this.prompt = '';
        this.systemPrompt = systemPrompt;
        this.contextWindow = [];
        this.url = url;
        this.fullResponse = [];
        this.httpClient = new HTTPClient(this.url);
    }

    async generateData() {
        try {
            const response = await this.httpClient.post('', { prompt: this.completePrompt });
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
export default OllamaRequestGenerator