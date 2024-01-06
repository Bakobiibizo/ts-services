import { OpenAI } from 'openai';

export interface Message {
    role: string;
    content: string;
}

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class OAIMessage implements Message {
    constructor(public role: string, public content: string) { }
}

export class OpenAIGenerator {
    private agentId: string = "asst_7LqdBFncNN4DarwwLj2JmxuN";

    constructor() { }

    public async initializeAgent(
        name: string = "Chatbot",
        instructions: string = "You are a friendly and helpful chatbot.",
        tools: Array<{ type: any }> = [{ type: "code_interpreter" }],
        model: string = "gpt-4-1106-preview"
    ) {
        const agent = await openAI.beta.assistants.create({
            name,
            instructions,
            tools,
            model
        });
        this.agentId = agent.id;
        return agent;
    }

    public async createThread() {
        return await openAI.beta.threads.create();
    }

    public async createMessage(threadId: string, inputPrompt: string) {
        return await openAI.beta.threads.messages.create(threadId, {
            role: "user",
            content: inputPrompt
        });
    }

    public async executeAssistant(threadId: string, callInstructions: string = "Please answer the users questions") {
        return await openAI.beta.threads.runs.create(threadId, {
            assistant_id: this.agentId,
            instructions: callInstructions
        });
    }

    public async checkStatus(threadId: string, runId: string) {
        return await openAI.beta.threads.runs.retrieve(threadId, runId);
    }

    public async getResults(threadId: string) {
        return await openAI.beta.threads.messages.list(threadId);
    }
}