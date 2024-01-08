import { Generator } from '../Generator.dt';
import { HTTPClient } from '../HTTPClient';
import * as os from "os";

export class OllamaRequestGenerator extends Generator {
    prompt: string;
    systemPrompt: string;
    contextWindow: [];
    url: string;
    fullResponse: any[];

    constructor() {
        super();
        this.prompt = '';
        this.systemPrompt = '';
        this.contextWindow = [];
        this.url = "https://api.openai.com/v1/api/chat/completions" //'https://2f89d1242d82.ngrok.app/api/generate';
        this.fullResponse = [];
    }

    constructFullPrompt(prompt: string, model: string = "ollama-mixtral", temperature: number = 0.7, max_tokens: number = 256, top_p: number = 1, frequency_penalty: number = 0, presence_penalty: number = 0) {
        this.constructMessage("user", prompt)
        let messages = ""
        for (let i of this.contextWindow) {
            messages += i["role"] + ": " + i["content"] + os.EOL
        }
        const oaiRequest = {
            model: model,
            prompt: messages,
        }
        return oaiRequest
    }

}
