import { qauackers } from "./agentManagement/agents/QAuackers";
import { OllamaRequestGenerator } from './generatorManagement/agentArtificial/OllamaRequestGenerator';
import * as fs from 'fs';
import { HTTPClient } from "./generatorManagement/HTTPClient";
import axios from 'axios'

//console.log(qauackers)

const ollama = new OllamaRequestGenerator()

ollama.setModel("dolphin-mixtral")
ollama.setSystemPrompt(qauackers.variableList.getItems()[2]["persona"])
ollama.setPrompt(qauackers.promptList.getItems()[0]["IDENTIFY_HTML"], "system")

const target = fs.readFileSync('tests/AgentArtificial.html').toString();

const request = ollama.constructFullPrompt(
    target,
    ollama.model
)

let text = ""
const callAPI = async () => {
    const client = new HTTPClient(request.model, request.prompt)
    const response = await client.makeRequest()
    text = response.data.response
}

console.log(callAPI())

fs.writeFileSync('tests/AgentArtificial2.html', text)