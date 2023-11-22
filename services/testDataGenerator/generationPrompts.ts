export const DATA_GENERATION_SYSTEM_PROMPT = `
You are an AI data set expert. 

OBJECTIVE:
You assist user requests to generate data. You can match any schema provided to you and generate data. 

REQUESTS:
You will receive a schema of a data structure or a short explanation of what kind of data is required. Examine the schema of the request and any additional details, provide a short explanation of the data structure, and then generate the data.

SCHEMA:
`
import anthropicRequest from "../anthropic/anthropic";
import { DATA_GENERATION_REQUEST_PROMPT } from './dataGenerationRequestPrompt';
import fs from "fs";
import TheCount from "";

console.info("Initializing Data Generation");

export class AnthropicDataGenerator {
    count: TheCount
    dataFileDirectory: string
    anthropicDir: string
    dataFilePath: string
    requestPrompt: string
    dataSchema: string
    prompt: string

    constructor(fileDir: string = "src/prompts/testDataGenerator/data") {
        // initialize the count for incrementing file names
        this.count = new TheCount(0);
        // set the data file directory
        this.dataFileDirectory = fileDir
        this.anthropicDir = `${this.dataFileDirectory}/anthropic`;
        this.dataFilePath = `${this.anthropicDir}/anthropicData_${this.count.countFilesInDir(this.anthropicDir)}.txt`;

        // initialize prompts
        this.requestPrompt = "";
        this.dataSchema = "";
        this.prompt = "";
    }

    // construct the prompt from a request prompt that defines that the ai should generate data based on a schema and a schema to base the genreation on
    buildPrompt(dataSchema: string, requestPrompt?: string): string {

        if (!dataSchema) { throw `No data schema provided`; }
        this.dataSchema = dataSchema;

        if (!requestPrompt) { this.requestPrompt = DATA_GENERATION_REQUEST_PROMPT; }
        else {
            this.requestPrompt = requestPrompt;
        }

        return `${this.requestPrompt}${this.dataSchema}`
    }

    // Sets the data schema
    setDataSchema(dataSchema: string) {
        if (!dataSchema) { throw `No data schema provided`; }
        this.dataSchema = dataSchema;
        return dataSchema
    }

    // Sets the filepath to save the data
    setDataFilePath(dataFilePath: string) {
        if (!dataFilePath) { throw `No data file path provided`; }
        this.dataFilePath = dataFilePath;
        return dataFilePath
    }

    // Check if the directory exists, if not, create it
    checkDir(anthropicDir: string) {
        if (!fs.existsSync(this.anthropicDir)) {
            fs.mkdirSync(anthropicDir, { recursive: true });
        }
        return anthropicDir
    }

    // Generate data
    async generateTestData(dataSchemaPrompt: string, outputPath?: string) {

        console.info("Generating test data");

        // Validate input
        if (dataSchemaPrompt) { this.setDataSchema(dataSchemaPrompt) };

        if (outputPath) { this.setDataFilePath(outputPath) };

        // Construct the prompt
        this.prompt = this.buildPrompt(dataSchemaPrompt);

        // Generate data
        const response = await anthropicRequest(this.prompt);

        // Clean data
        const generatedData = response.split('```')[1].trim();

        console.debug(generatedData)

        // make sure path exists
        this.checkDir(this.anthropicDir)

        // Save to file
        fs.writeFileSync(this.dataFilePath, generatedData, { encoding: 'utf8' });

    }
}


const generator = new AnthropicDataGenerator();
generator.generateTestData(DATA_GENERATION_REQUEST_PROMPT);
