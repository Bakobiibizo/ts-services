import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import { DATA_GENERATION_SYSTEM_PROMPT } from '../testDataGenerator/generationPrompts';
import { AnthropicPromptTemplate } from "./anthropicPromptTemplate";

console.info("Initializing Anthropic");

// load environment variables
dotenv.config();

// initialize the anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Make request to anthropic
export default async function anthropicRequest(
    userMessage: string,
    systemPrompt: string = DATA_GENERATION_SYSTEM_PROMPT,
    selectedModel: string = "claude-2.1",
    maxTokensToSample: number = 1000,
    temperature: number = 0.2,
): Promise<string> {

    console.info("Making request to anthropic");

    if (!userMessage) { throw `No user message provided`; }

    try {
        // Make request
        const template = new AnthropicPromptTemplate(systemPrompt, userMessage)
        const fullPrompt = template.constructPrompt()

        console.debug(fullPrompt)

        const completion = await anthropic.completions.create({
            model: selectedModel,
            max_tokens_to_sample: maxTokensToSample,
            temperature: temperature,
            prompt: fullPrompt
        });

        console.debug(completion.completion);

        return completion.completion

    } catch (error) {
        console.error(error);
        throw `Error during generation: ${error}`;

    }
}