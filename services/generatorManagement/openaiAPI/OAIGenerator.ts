import { Generator, GeneratorList } from "../Generator.dt";
import OpenAI from "openai";
import * as dotenv from 'dotenv';
import { OAIMessage, OAIMessages, OAIRequest } from './OAIRequest.dt';
import { HTTPClient } from '../HTTPClient';

dotenv.config();

export class OAIGenerator extends Generator {
    api_key?: string;
    openai: OpenAI;
    constructor() {
        super();
        this.api_key = process.env.OPENAI_API_KEY;
        this.openai = new OpenAI({ apiKey: this.api_key });
        this.prompt = ""
        this.systemPrompt = ""
        this.url = "https://api.openai.com/v1/chat/completions"
        this.fullResponse = [];
        this.httpClient = new HTTPClient(this.url);
    }
    constructMessage(role: string, content: string) {
        return { role: role, content: content };
    }
    constructOAIRequest(systemPrompt: string, userMessages: OAIMessage[], model: string, temperature: number, max_tokens: number, top_p: number, frequency_penalty: number, presence_penalty: number, stop: string[]) {
        this.constructMessage("system", systemPrompt)

        return {
            model: model,
            messages: userMessages,
            temperature: temperature,
            max_tokens: max_tokens,
            top_p: top_p,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty,
            stop: stop
        }
    }
    openaiRequest(OAIRequest: OAIRequest) {
        const response = this.openai.chat.completions.create({
            model: OAIRequest.model,
            messages: OAIRequest.messages,
            temperature: OAIRequest.temperature,
            max_tokens: OAIRequest.max_tokens,
            top_p: OAIRequest.top_p,
            frequency_penalty: OAIRequest.frequency_penalty,
            presence_penalty: OAIRequest.presence_penalty,
            stop: OAIRequest.stop
        })

            (OAIRequest)
            .then((response) => {
                resolve(response.data.choices[0].text);
            })
            .catch((error) => {
                reject(error);
            });
    }
}


}
