import OpenAI from "openai";
import * as dotenv from 'dotenv';
import { getAgentManager } from "./agentManagement/agentManager";
import { qauackersAgent } from "./variableManagement/variables/QAuackers";
import * as fs from "fs";

dotenv.config();

const agentManager = getAgentManager()

agentManager.createAgent(qauackersAgent.name, qauackersAgent.description, qauackersAgent.promptList, qauackersAgent.variablesList)

const QAuackers = agentManager.getItems()[0]

const { prompt } = QAuackers.promptList.getItems()[0]
const targetHTML = fs.readFileSync("tests/AgentArtificial.html").toString()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function check(systemPrompt: string, targetHTML: string) {
    const results = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [{
            "role": "system",
            "content": systemPrompt
        },
        {
            "role": "user",
            "content": targetHTML
        }],
    })
    const parsed = JSON.stringify(results.choices[0].message.content)
    fs.writeFileSync("tests/check.txt", parsed);
}

console.log(prompt, targetHTML)
console.log(check(prompt, targetHTML))