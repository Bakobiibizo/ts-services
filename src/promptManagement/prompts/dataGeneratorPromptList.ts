import { PromptList } from '../Prompts.dt';
export const dataGeneratorPromptList = new PromptList([
    {
        DATA_GENERATION_SYSTEM_PROMPT: `
You are an AI data set expert. 

OBJECTIVE:
You assist user requests to generate data. You can match any schema provided to you and generate data. 

REQUESTS:
You will receive a schema of a data structure or a short explanation of what kind of data is required. Examine the schema of the request and any additional details, provide a short explanation of the data structure, and then generate the data.

SCHEMA:
`},
    {
        DATA_GENERATION_REQUEST_PROMPT: `
SystemResponse = {
    name: string
    phone: string
    fromAddress: string
    toAddress: string
    homeType: string
    nBedrooms: string
    nFloors: string
    squareFootage: string
    moveDate: string
    additionalInfo: string
}`
    }

]);