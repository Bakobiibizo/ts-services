import { ChatCompletionMessageParam } from 'openai/resources';

export class OAIMessage {
    constructor(public role: "assistant" | "user" | "system" | "function" | "tool", public content: string, public name?: string) {
        this.role = role
        this.content = content
        this.name = name
    }

    createMessage(role: "assistant" | "user" | "system" | "function" | "tool", content: string, name?: string) {
        this.role = role 
        this.content = content
        this.name = name ?? undefined
        const message = {
            role: role,
            content: content,
            name: name
        }
        return message
    }
}

export class OAIRequest {
    model: string
    messages: ChatCompletionMessageParam[]
    temperature: number
    max_tokens: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    stop: string[]
    constructor(model: string = "gpt-4", messages: ChatCompletionMessageParam[], temperature: number = 0.2, max_tokens: number = 32000, top_p: number = 1, frequency_penalty: number = 0, presence_penalty: number = 0, stop: string[] = ["User: ", "Assistant: "]) {
        this.model = model
        this.messages = messages
        for (let i = 0; i < messages.length; i++) {
            this.messages.push(messages[i])
        }
        this.temperature = temperature
        this.max_tokens = max_tokens
        this.top_p = top_p
        this.frequency_penalty = frequency_penalty
        this.presence_penalty = presence_penalty
        this.stop = stop
    }
}