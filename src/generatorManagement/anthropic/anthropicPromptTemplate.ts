import { HUMAN_PROMPT, AI_PROMPT } from "@anthropic-ai/sdk"

export type AnthropicTemplate = {
    humanRole: string
    assistantRole: string

    systemPrompt: string
    userMessage: string

    constructPrompt(): string
}

export class AnthropicPromptTemplate implements AnthropicTemplate {
    humanRole: string
    assistantRole: string

    systemPrompt: string
    userMessage: string
    constructor(systemMessage: string, userMessage: string) {
        this.humanRole = HUMAN_PROMPT
        this.assistantRole = AI_PROMPT

        this.systemPrompt = systemMessage
        this.userMessage = userMessage
    }

    constructPrompt(): string {
        console.info("constructPrompt")
        return `${this.systemPrompt}${this.humanRole}${this.userMessage}${this.assistantRole}`
    }
}