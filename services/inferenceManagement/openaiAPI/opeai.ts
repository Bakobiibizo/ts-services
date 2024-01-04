import { OpenAI } from 'openai'
import * as dotenv from 'dotenv';
import * as fs from 'fs';


export type Message = {
    role: string
    content: string
}

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class OAIMessage implements Message {
    role: string
    content: string
    constructor(role: string, content: string) {
        this.role = role
        this.content = content
    }
}

export class OpenAIGenerator {

    openai: any
    agent: any
    thread: any
    run: any
    message: any
    status: any
    results: any
    constructor() {
        this.openai = openai
        this.agent = "asst_7LqdBFncNN4DarwwLj2JmxuN"
        this.message = JSON.parse(fs.readFileSync("./tests/message.json", { encoding: 'utf8' }))
        this.thread = JSON.parse(fs.readFileSync("./tests/thread.json", { encoding: 'utf8' }))
        this.run = JSON.parse(fs.readFileSync("./tests/run.json", { encoding: 'utf8' }))
        this.status = JSON.parse(fs.readFileSync("./tests/status.json", { encoding: 'utf8' }))
        this.results = ""
    }
    public async initializeAgent(
        name: string = "Chatbot",
        instructions: "You are a friendly and helpful chatbot",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-1106-preview"
    ) {
        const agent = await openai.beta.assistants.create({
            name: name,
            instructions: instructions,
            tools: tools,
            model: model
        });
        fs.writeFileSync("tests/agent.json", JSON.stringify(agent))
        this.agent = agent
        return agent
    }
    public async initializedThread() {
        const thread = await openai.beta.threads.create();
        fs.writeFileSync("tests/thread.json", JSON.stringify(thread))
        this.thread = thread
        return thread
    }
    public async constructMessage(inputPrompt: string) {
        const message = await openai.beta.threads.messages.create(
            this.thread.id,
            {
                role: "user",
                content: inputPrompt
            }
        );
        fs.writeFileSync("tests/message.json", JSON.stringify(message))
        this.message = message
        return message
    }
    public async runAssistant(callInstructions: string = "Please answer the users questions") {
        const run = await openai.beta.threads.runs.create(
            this.thread.id,
            {
                assistant_id: this.agent.id,
                instructions: callInstructions
            }
        );
        fs.writeFileSync("tests/run.json", JSON.stringify(run))
        this.run = run
        return run
    }
    public async checkStatus(threadID: string = this.thread.id, runID: string = this.run.id) {
        const status = await openai.beta.threads.runs.retrieve(
            threadID,
            runID
        );
        fs.writeFileSync("tests/status.json", JSON.stringify(status))
        this.status = status
        return status
    }
    public async displayResult(threadID: string = this.thread.id) {
        const results = await openai.beta.threads.messages.list(
            threadID
        );
        fs.writeFileSync("tests/results.json", JSON.stringify(results))
        this.results = results
        return results

    }
}


