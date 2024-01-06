import { HTTPClient } from './HTTPClient';
import { GenericList } from '../commonTypes.dt';

export class Generator {
    prompt: string;
    systemPrompt: string;
    completePrompt: string;
    url: string;
    fullResponse: any[];
    httpClient: HTTPClient;
    constructor() {
        this.prompt = '';
        this.systemPrompt = '';
        this.completePrompt = '';
        this.url = '';
        this.fullResponse = [];
        this.httpClient = new HTTPClient('');
    }
    setPrompt(prompt: string) {
        this.prompt = prompt;
        this.completePrompt = `${this.systemPrompt}${this.prompt}`;
    }
    setSystemPrompt(systemPrompt: string) {
        this.systemPrompt = systemPrompt;
        this.completePrompt = `${this.systemPrompt}${this.prompt}`;
    }
    setCompletePrompt(completePrompt: string) {
        this.completePrompt = completePrompt;
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
export class GeneratorList extends GenericList<Generator> {
    constructor(generator: Generator[]) {
        super();
        this.setItems(...generator);
    }
}