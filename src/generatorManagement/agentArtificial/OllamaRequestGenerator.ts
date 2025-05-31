import { Generator } from '../Generator.dt';
import { HTTPClient } from '../HTTPClient';
import * as os from "os";
import * as dotenv from 'dotenv';
dotenv.config();

export class OllamaRequestGenerator extends Generator {
    prompt: string;
    systemPrompt: string;
    contextWindow: [];
    url: string;
    fullResponse: any[];
    http: HTTPClient

    constructor() {
        super();
        this.prompt = '';
        this.systemPrompt = '';
        this.contextWindow = [];
        this.url = process.env.BASE_URL || ""
        this.fullResponse = [];
        this.http = new HTTPClient();
    }
    makeRequest(prompt: string) {
        return this.http.makeRequest(prompt)
    }

    constructFullPrompt(prompt: string, model: string = "ollama-mixtral", temperature: number = 0.1, max_tokens: number = 256, top_p: number = 1, frequency_penalty: number = 0, presence_penalty: number = 0) {
        this.constructMessage("user", prompt)
        let messages = ""
        for (let i of this.contextWindow) {
            messages += `${i["role"] + ": " + i["content"] + os.EOL}`
        }
        return {
            model: model,
            prompt: messages,
        }
    }

}
