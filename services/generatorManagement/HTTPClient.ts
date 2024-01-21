import axios from "axios";

export class HTTPClient {
    private client
    options: any

    constructor(model = 'dolphin-mistral', prompt = 'hi there') {
        this.options = {
            method: 'POST',
            url: 'https://chat-agentartificial.ngrok.app/api/generate',
            headers: { 'Content-Type': 'application/json' },
            data: { model: model, prompt: prompt, stream: false },
        }
        this.client = axios.request
    }
    setOptions(method: string, url: string, headers: { 'Content-Type': 'application/json' }, data: { model: string, prompt: string, stream: boolean }) {
        this.options.method = method
        this.options.url = url
        this.options.headers = headers
        this.options.data = data
    }
    async makeRequest(prompt: any) {
        this.options.data = prompt
        return await this.client(this.options)
    };
}
