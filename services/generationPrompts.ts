import { getAgentManager } from "./agentManagement/agentManager";
import { qauackersAgent } from "./agentManagement/agents/QAuackers";
import { AnthropicPromptTemplate } from "./inferenceManagement/anthropic/anthropicPromptTemplate";
import anthropicRequest from "./inferenceManagement/anthropic/anthropicGenerator";
import TheCount from "./utils/theCount/counter"
import { SystemResponse } from './promptManagement/prompts/systemResponse.dt';
import * as fs from "fs";
import { AnthropicDataGenerator } from "./testDataGenerator/generationPrompts";

const agentManager = getAgentManager()

agentManager.createAgent(qauackersAgent.name, qauackersAgent.description, qauackersAgent.promptList, qauackersAgent.variablesList)

const QAuackers = agentManager.getItems()[0]

const { prompt } = QAuackers.promptList.getItems()[0]

console.log(QAuackers)
console.log(prompt)


const targetHTML = fs.readFileSync("tests/AgentArtificial.html").toString()

const fileDir = "./tests"

const dataDir = `${fileDir}/dataDir`
/*
export class RequestGenerator {
    dataFileDirectory: string
    requestPrompt: string
    prompt: string

    constructor(fileDir: string = "src/prompts/testDataGenerator/data") {
        // initialize the count for incrementing file names
        // set the data file directory
        this.dataFileDirectory = fileDir
        // initialize prompts
        this.requestPrompt = "";
        this.prompt = "";
    }

    // construct the prompt from a request prompt that defines that the ai should generate data based on a schema and a schema to base the genreation on
    buildPrompt(requestPrompt: string): string {
        this.requestPrompt = `${new AnthropicPromptTemplate("system", prompt).constructPrompt()}}\n\n${targetHTML}`
        return this.dataFileDirectory
    }

    // Check if the directory exists, if not, create it
    checkDir(anthropicDir: string) {
        if (!fs.existsSync(this.dataFileDirectory)) {
            fs.mkdirSync(anthropicDir, { recursive: true });
        }
        return anthropicDir
    }

    // Generate data
    async generateTestData() {

        console.info("Generating test data");

        // Generate data
        const response = await anthropicRequest(this.prompt);

        // Clean data
        const generatedData = response.split('```')[1].trim();

        console.debug(generatedData)

        // make sure path exists
        this.checkDir(this.dataFileDirectory)

        // Save to file
        fs.writeFileSync(this.dataFileDirectory, generatedData, { encoding: 'utf8' });

    }
}

const generator = new RequestGenerator();
generator.generateTestData()
*/


