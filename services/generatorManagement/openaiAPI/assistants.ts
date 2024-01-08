import { OpenAI } from 'openai';
import { HTTPClient } from '../HTTPClient';


const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAIAssistant {
    constructor(public role: string, public content: string) { }
}

export class OpenAIGenerator {
    private agentId: string = "asst_7LqdBFncNN4DarwwLj2JmxuN";
    prompt: string;
    systemPrompt: string;
    url: string;
    openai: OpenAI;
    fullResponse: any[];
    httpClient: any;
    model: string
    message: {
        role: string
        content: string
    }
    contextWindow: []

    constructor() {
        this.model = "gpt-3.5-turbo-0613";
        this.prompt = "";
        this.systemPrompt = '';
        this.message = { role: "user", content: "" };
        this.url = "https://api.openai.com/v1/chat/completions";
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: this.url });
        this.fullResponse = [];
        this.httpClient = new HTTPClient(this.url);
        this.contextWindow = [];
    }

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