import { AgentManager, Agent } from "./agentManagement/agentManager";
import { IDENTIFY_HTML_PROMPT } from "./promptManagement/prompts/qaPrompts";

export const agentManager = new AgentManager();



const quackers: Agent = agentManager.agentList.getItem("quackers")


import { int } from "neo4j-driver";
import { Document } from '../__generated__/ogm-types';
import { getContextedUserInfo } from "../auth";
import { cfg } from "../cfg";
import { Context } from "../context";
import { driver } from "../neo4j";
import { FunctionDefinition, Prompt, sendSystemMessage } from "../openai";


export async function generateStartPromptV2(
    ctx: Context,
) {
    // const jwt = ctx.authorization?.
    const info = await getContextedUserInfo(ctx);
    const name = info.name;

    const content = `
You are a skilled operations manager for a moving company called ${cfg.company.name}. You talk with the owner to work through problems, run functions, and communicate with other specialists.

You are currently talking to ${name} who works at the ${cfg.company.name}
You can write documents to the database by calling the function "write_data" and find data for later with "read_data". The owner cannot run these functions so you will have to run them for him.
You are the access point to the API and its functionality. The owner is relying on your to run the required commands since he cannot run them him self. 
The core system runs off of a Neo4j Graphql database. Use the commands to get and set data in the database or to mutate the database.

The current time is ${new Date().toString()} ensure all date and datetime outputs include this timezone.

Start by asking the owner how he is doing with some brief personal touch, and how you can help.
Let him briefly know how you can help run his moving company.
`;


    const functions: FunctionDefinition[] = [
        {
            name: 'write_data',
            description: 'Write data, create or update, to the vector database to be search for in the future with "read_data"',
            parameters: {
                type: 'object',
                required: ['name', 'content'],
                properties: {
                    update: {
                        type: 'string',
                        description: 'The ID of an existing document to update, leave blank to create a new document',
                    },
                    name: {
                        type: 'string',
                        description: 'The title of the data in no more than one sentence',
                        minLength: 1,
                        maxLength: 280,
                    },
                    content: {
                        type: 'string',
                        description: 'The content of the data to write',
                        minLength: 1,
                        maxLength: 100000,
                    }
                },
            },
            handler: async (conversation, msg, args, functions) => {

                // ctx.log.info(args, msg);

                const input = args.name + `\n` + args.content;

                const embeddingResult = await ctx.openai.embeddings.create({
                    input,
                    model: 'text-embedding-ada-002',
                });

                let document: Document;
                if (args.update) {

                    const { documents } = await ctx.ogm.model('Document').update({
                        context: ctx,
                        where: {
                            id: args.update,
                        },
                        update: {
                            name: args.name,
                            content: args.content,
                            embedding: embeddingResult.data[0].embedding,
                        },
                    });
                    document = documents[0];
                } else {
                    const { documents } = await ctx.ogm.model('Document').create({
                        context: ctx,
                        input: [{
                            name: args.name,
                            content: args.content,
                            embedding: embeddingResult.data[0].embedding,
                        }],
                    });
                    document = documents[0];
                }
                ctx.log.info(`Added embedding: ${args.name}: ${args.content}`);

                await sendSystemMessage(ctx, conversation, `Wrote ${args.name} (document ${document.id}) to the database`, true, functions);
            },
        },
        {
            name: 'delete_data',
            description: 'Delete data from the database so it cannot be read anymore. Use caution and confirm with the user before running t his function!',
            parameters: {
                type: 'object',
                required: ['ids'],
                properties: {
                    ids: {
                        type: 'array',
                        description: 'An array of document IDs to delete',
                        items: {
                            type: 'string',
                            description: 'The ID of an existing document to delete',
                        }
                    },
                },
            },
            handler: async (conversation, msg, args, functions) => {

                // ctx.log.info(args, msg);
                if (!args.ids?.length) {
                    throw new Error(`No IDs passed to delete_data`);
                }

                const { nodesDeleted } = await ctx.ogm.model('Document').delete({
                    context: ctx,
                    where: {
                        id_IN: args.ids,
                    },
                });

                await sendSystemMessage(ctx, conversation, `Deleted ${nodesDeleted} documents from the database`, true, functions);
            },
        },
        {
            name: 'read_data',
            description: 'Read data to the database and return the top results',
            parameters: {
                type: 'object',
                required: ['name', 'content'],
                properties: {
                    search: {
                        type: 'string',
                        description: 'A document to search for by string',
                        minLength: 1,
                        maxLength: 1024,
                    },
                    page: {
                        type: 'number',
                        description: 'The page of results we are should get, you will probably want to start with 1',
                        default: 1,
                    },
                    resultsPerPage: {
                        type: 'number',
                        description: 'Number of results to return. A lower number is suggested to keep context length low',
                        default: 5,
                        minLength: 1,
                        maxLength: 100,
                    }
                },
            },
            handler: async (conversation, msg, args, functions) => {

                // CALL db.index.vector.createNodeIndex('document-embeddings', 'Document', 'embedding', 1536, 'cosine')

                ctx.log.info(`Search db for ${args.search}`);

                const embeddingResult = await ctx.openai.embeddings.create({
                    input: args.search,
                    model: 'text-embedding-ada-002',
                });

                const embedding = embeddingResult.data[0].embedding;
                const resultsPerPage = args.resultsPerPage || 5;
                const page = args.page || 1

                const session = driver.session();
                const res = await session.executeRead(async (tx) => {
                    return await tx.run(`
                        CALL db.index.vector.queryNodes('document-embeddings', 10, $embedding)
                        YIELD node AS document, score

                        return document{.*}, score
                        SKIP $skip
                        LIMIT $limit
                    `, {
                        skip: int(resultsPerPage * (page - 1)),
                        limit: int(resultsPerPage),
                        embedding,
                    });

                });

                await session.close();

                let message = `The following documents match your search:\n`;

                if (res.records.length) {

                    message += res.records.map((r, index) => {
                        const record = r.toObject();
                        const doc = record.document;
                        return `[${index + resultsPerPage * (page - 1)}] ${doc.name} - ${doc.id}:\n${doc.content}\n---\n`;
                    });

                    message += 'Communicate these results in a clear, concise, and easy to understand way.'
                } else {
                    message += 'No data, communicate this result in an easy to understand way'
                }

                await sendSystemMessage(ctx, conversation, message, true, functions);

                return;
            },
        }
    ];

    return {
        content,
        // model: 'gpt-4',
        model: 'gpt-4-1106-preview',
        functions,
    } as Prompt;

}


export async function generateStartPrompt(
    ctx: Context,
) {
    // const jwt = ctx.authorization?.
    const info = await getContextedUserInfo(ctx);
    const name = info.name;

    const startPrompt = PromptAgent

    return startPrompt;

}
