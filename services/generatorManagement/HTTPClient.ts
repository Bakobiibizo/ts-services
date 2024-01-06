import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class HTTPClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async post(endpoint: string, data: any): Promise<AxiosResponse> {
        try {
            return await this.client.post(endpoint, data, {
                responseType: 'stream'
            });
        } catch (error) {
            console.error('Error in HTTP POST:', error);
            throw error; // Rethrow for further handling if needed
        }
    }
}
