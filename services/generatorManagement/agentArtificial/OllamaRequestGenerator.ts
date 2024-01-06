import { HTTPClient } from '../HTTPClient';

class OllamaRequestGenerator {
    prompt: string;
    systemPrompt: string;
    completePrompt: string;
    url: string;
    fullResponse: any[];
    httpClient: HTTPClient;

    constructor(systemPrompt: string, url: string) {
        this.prompt = '';
        this.systemPrompt = systemPrompt;
        this.completePrompt = `${this.systemPrompt}${this.prompt}`;
        this.url = url;
        this.fullResponse = [];
        this.httpClient = new HTTPClient(url);
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