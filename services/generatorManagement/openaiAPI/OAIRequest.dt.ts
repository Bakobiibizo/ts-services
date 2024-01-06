export class OAIMessage {
    role: string
    content: string
    constructor(role: string, content: string) {
        this.role = role
        this.content = content
    }
}
export class OAIMessages extends Array<OAIMessage> {
    constructor() {
        super();
    }
    create(role: string, content: string) {
        this.push(new OAIMessage(role, content))
        return this
    }
    add(message: OAIMessage) {
        this.push(message)
        return this
    }
    remove(index: number) {
        this.splice(index, 1)
        return this
    }
}


export class OAIRequest {
    model: string
    messages: OAIMessages
    temperature: number
    max_tokens: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    stop: string[]
    constructor(model: string = "gpt-4", messages: OAIMessage[], temperature: number = 0.2, max_tokens: number = 32000, top_p: number = 1, frequency_penalty: number = 0, presence_penalty: number = 0, stop: string[] = ["User: ", "Assistant: "]) {
        this.model = model
        this.messages = new OAIMessages()
        for (let i = 0; i < messages.length; i++) {
            this.messages.add(messages[i])
        }
        this.temperature = temperature
        this.max_tokens = max_tokens
        this.top_p = top_p
        this.frequency_penalty = frequency_penalty
        this.presence_penalty = presence_penalty
        this.stop = stop
    }
}