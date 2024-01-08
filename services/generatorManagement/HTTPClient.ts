import axios from "axios";

export class HTTPClient {
    private client
    options: any

    constructor(model = 'dolphin-mistral', prompt = 'hi there') {
        this.options = {
            method: 'POST',
            url: 'https://2f89d1242d82.ngrok.app/api/generate',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/2023.5.8' },
            data: { model: model, prompt: prompt, stream: false },
        }
        this.client = axios.request
    }
    async makeRequest() { return await this.client(this.options) };
}
