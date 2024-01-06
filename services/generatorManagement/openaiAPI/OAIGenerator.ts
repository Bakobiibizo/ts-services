import { Generator, GeneratorList } from "../Generator.dt";
import OpenAI from "openai";
import * as dotenv from 'dotenv';

dotenv.config();

export class OAIGenerator extends Generator {

    constructor() {
        super(
            new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),

        );
    }
}

new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default openai

