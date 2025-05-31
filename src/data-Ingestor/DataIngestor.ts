import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
import { extractHtml } from './extractHtml';
import { extractJSX } from './extractJSX';
import { extractTSHtmlBlock } from './extractTSHTMLBlock';
import { extractRustCode } from './extractRustCode';
import { DirectoryParser } from './DirectoryParser';

export default class DataIngestor {
    static mirrorDirectory = "data/mirror"
    static createMirrorDirectory(): void {
        if (!fs.existsSync(DataIngestor.mirrorDirectory)) {
            fs.mkdirSync(DataIngestor.mirrorDirectory, { recursive: true });
        }
    }

    static pathMapContent: any;
    static directoryParser: DirectoryParser = new DirectoryParser();
    static dataMap: any = {};
    static mirrorMap: string = 'data/mirrorMap.json';

    public static generatePathmap(filepath = process.env.TARGET_PATH || 'data/mirrorMap.json'): void {
        DataIngestor.directoryParser.writeStructureToFile(filepath);
    }

    public static readPathMap(filepath: string): void {
        const fileContent = fs.readFileSync(filepath, "utf8");
        DataIngestor.pathMapContent = JSON.parse(fileContent);
    }

    public static ingestTSCodeBlocks(filePath: string): void {
        DataIngestor.dataMap[filePath] = extractTSHtmlBlock(filePath);
    }

    public static async ingestFile(filePath: string): Promise<void> {
        const fileExtension = filePath.split('.').pop()?.toLowerCase();
        try {
            let content: string = '';
            
            switch (fileExtension) {
                case 'html':
                    content = extractHtml(filePath);
                    break;
                case 'tsx':
                case 'jsx':
                    content = extractJSX(filePath);
                    break;
                case 'ts':
                case 'js':
                    content = extractTSHtmlBlock(filePath);
                    break;
                case 'rs':
                    content = await extractRustCode(filePath);
                    break;
                default:
                    console.log(`Unsupported file type: ${fileExtension}`);
                    return;
            }
            
            DataIngestor.dataMap[filePath] = content;
            DataIngestor.directoryParser.createMirrorFile(filePath);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }

    // Keep the old method for backward compatibility
    public static ingestHtmlFile(filePath: string): void {
        console.warn('ingestHtmlFile is deprecated. Use ingestFile instead.');
        this.ingestFile(filePath).catch(console.error);
    }

    public static async processPathmap(pathmap: any) {
        fs.writeFileSync(DataIngestor.mirrorMap, JSON.stringify(DataIngestor.dataMap, null, 2));
        
        const processItem = async (key: string, value: any) => {
            if (typeof value === 'string') {
                await DataIngestor.ingestFile(value).catch(console.error);
            } else if (typeof value === 'object') {
                await DataIngestor.processPathmap(value);
            }
        };
        
        // Process items in parallel but wait for all to complete
        await Promise.all(
            Object.entries(pathmap).map(([key, value]) => processItem(key, value))
        );
    }
}

//// Initialize and process the path map
//DataIngestor.generatePathmap();
//DataIngestor.readPathMap(DataIngestor.directoryParser.filemap);
//DataIngestor.processPathmap(DataIngestor.pathMapContent);
//