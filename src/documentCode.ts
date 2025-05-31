
import * as fs from 'fs';
import * as dotenv from 'dotenv';

import { OllamaRequestGenerator } from './generatorManagement/agentArtificial/OllamaRequestGenerator';
import { AgentManager } from './agentManagement/AgentManager';

dotenv.config();

//console.log(qauackers)

export async function replace_target(target: string) {

    const ollama = new OllamaRequestGenerator()

    ollama.setModel(process.env.MODEL || "llama4")
    ollama.setSystemPrompt(AgentManager.getItems()[2].variableList.getItems()[2]["persona"])
    ollama.setPrompt(AgentManager.getItems()[2].promptList.getItems()[0]["CODE_DOCUMENTATION_SYSTEM_PROMPT"], "system")



    const request = ollama.constructFullPrompt(
        target,
        ollama.model
    )

    let fullResponse: string = ''
    let htmlResponse: string = ''
    async function get_response(request: any) {

        try {
            const response = await ollama.makeRequest(request)
            fullResponse += response.data
            return fullResponse

        } catch (e) {
            console.log(e)
        }
    }
    (async () => {
        const response = await get_response(request)
        if (!response) { throw new Error('No response received'); }
        else {
            const lines = response.split('\n')
            try {
                lines.forEach(line => {
                    const json = JSON.parse(line)
                    htmlResponse += json.response
                    console.log(htmlResponse)
                })
            } catch (e) {
                console.log(e)
            }
            fs.writeFileSync('test.html', htmlResponse)
        }
    })()
    return htmlResponse
}