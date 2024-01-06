import * as dotenv from "dotenv";
import { HTTPClient } from '../HTTPClient'
import { AnthropicPromptTemplate } from "./anthropicPromptTemplate";
import { dataGeneratorPromptList } from '../../promptManagement/prompts/dataGeneratorPromptList';
import { Generator } from "../Generator.dt";

console.info("Initializing Anthropic");

// load environment variables
dotenv.config();

export class AnthropicGenerator extends Generator {
    apiKey: string;

    constructor() {
        super();
        this.apiKey = process.env.ANTHROPIC_API_KEY || '';
        this.prompt = "";
        this.systemPrompt = "";
        this.completePrompt = "";
        this.url = "https://api.anthropic.com/v1/complete";
        this.fullResponse = [];
        this.httpClient = new HTTPClient(this.url);
    }

    // Make request to anthropic
    async anthropicRequest(
        userMessage: string,
        systemPrompt: string = dataGeneratorPromptList.getItem("DATA_GENERATION_SYSTEM_PROMPT"),
        selectedModel: string = "claude-2.1",
        maxTokensToSample: number = 1000,
        temperature: number = 0.2,
    ): Promise<string> {

        console.info("Making request to Anthropic");

        if (!userMessage) { throw new Error('No user message provided'); }

        try {
            // Construct the prompt
            const template = new AnthropicPromptTemplate(systemPrompt, userMessage);
            const fullPrompt = template.constructPrompt();
            console.debug(fullPrompt);

            // Prepare the request body
            const requestBody = {
                model: selectedModel,
                max_tokens_to_sample: maxTokensToSample,
                temperature: temperature,
                prompt: fullPrompt,
                api_key: this.apiKey, // Include the API key if needed in the request body, otherwise use headers or authentication methods as required.
            };

            // Make the HTTP POST request
            const response = await this.httpClient.post('/completions/create', requestBody); // Adjust the endpoint as needed
            const completion = response.data;

            console.debug(completion.completion);
            return completion.completion;

        } catch (error) {
            console.error(error);
            throw new Error(`Error during generation: ${error}`);
        }
    }
}
export default AnthropicGenerator