import { Generator } from "../Generator.dt";
import OpenAI from "openai";
import * as dotenv from 'dotenv';
import { HTTPClient } from '../HTTPClient';
import { ChatCompletionContentPartImage, ChatCompletionFunctionMessageParam, ChatCompletionMessageParam, ChatCompletionMessage, ChatCompletionUserMessageParam } from 'openai/resources';
import { OAIMessage } from "./OAIRequest.dt";

dotenv.config();

export class OAIGenerator extends Generator {
    prompt: string;
    systemPrompt: string;

    api_key?: string;
    url: string;
    openai: OpenAI;
    fullResponse: any[];
    httpClient: HTTPClient;
    contextWindow: any[] = []
    temperature: number
    max_tokens: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    constructor(url: string = "https://api.openai.com/v1/chat/completions") {
        super();
        this.prompt = "";
        this.systemPrompt = '';
        this.api_key = process.env.OPENAI_API_KEY;
        this.url = url
        this.openai = new OpenAI({ apiKey: this.api_key, baseURL: this.url });
        this.fullResponse = [];
        this.httpClient = new HTTPClient(this.url);
        this.contextWindow = [];
        this.temperature = 0.1
        this.max_tokens = 32000
        this.top_p = 1
        this.frequency_penalty = 0
        this.presence_penalty = 0
    }

    setPrompt(prompt: string): any{
        this.prompt = prompt
        const message = this.constructMessage("user", prompt)
        this.contextWindow.push(message)
        return message
    }

    setSystemPrompt(prompt: string): any {
        this.systemPrompt = prompt
        const message = this.constructMessage("system", prompt)
        this.contextWindow.push(message)
        return message
    }

    setModel(model: string) {
        this.model = model
    }

    setTemperature(temperature: number) {
        this.temperature = temperature
    }

    setMaxTokens(max_tokens: number) {
        this.max_tokens = max_tokens
    }

    setTopP(top_p: number) {
        this.top_p = top_p
    }

    setFrequencyPenalty(frequency_penalty: number) {
        this.frequency_penalty = frequency_penalty
    }

    setPresencePenalty(presence_penalty: number) {
        this.presence_penalty = presence_penalty
    }

    constructMessageParam(role: "function" | "system" | "user" | "assistant" | "tool", content: string, name?: string): any {
        return {
            role: role,
            content: content,
            name: name ? name : ""
        }
    }


    constructFullPrompt(model: string = "ollama-mixtral", temperature: number = 0.7, max_tokens: number = 256, top_p: number = 1, frequency_penalty: number = 0, presence_penalty: number = 0) {
        return {
            model: model,
            messages: this.contextWindow,
            temperature: temperature,
            max_tokens: max_tokens,
            top_p: top_p,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty
        }

    }
    async openaiRequest() {
        const oaiRequest = this.constructFullPrompt(this.model, this.temperature, this.max_tokens, this.top_p, this.frequency_penalty, this.presence_penalty);
        const response = await this.openai.chat.completions.create(oaiRequest)
            .then((response) => {
                if (response.object === "chat.completion") {
                    return response.choices[0].message
                }
            })
            .catch((error) => {
                console.error('Error during generateData:', error);
            })
        return response
    }
}