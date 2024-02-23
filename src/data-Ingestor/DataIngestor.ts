import * as fs from 'fs';
import { extractHtml } from './extractHtml';
import { extractJSX } from './extractJSX';
import { extractTSHtmlBlock } from './extractTSHTMLBlock';
import { DirectoryParser } from './DirectoryParser';

export default class DataIngestor {
    static pathMapContent: any;
    static mirrorDirectory: string = "data/mirror";
    static directoryParser: DirectoryParser = new DirectoryParser();
    static dataMap: any = {};
    static mirrorMap: string = 'data/mirrorMap.json';

    public static generatePathmap(filepath = 'tests/testPlace/'): void {
        DataIngestor.directoryParser.writeStructureToFile(filepath);
    }

    public static readPathMap(filepath: string): void {
        const fileContent = fs.readFileSync(filepath, "utf8");
        DataIngestor.pathMapContent = JSON.parse(fileContent);
    }

    public static ingestTSCodeBlocks(filePath: string): void {
        DataIngestor.dataMap[filePath] = extractTSHTMLBlock(filePath);
    }

    public static ingestHtmlFile(filePath: string): void {
        const fileExtension = filePath.split('.').pop();
        switch (fileExtension) {
            case 'html':
                DataIngestor.dataMap[filePath] = extractHtml(filePath);
                DataIngestor.directoryParser.createMirrorFile(filePath)
                break;
            case 'tsx':
            case 'jsx':
                DataIngestor.dataMap[filePath] = extractJSX(filePath);
                DataIngestor.directoryParser.createMirrorFile(filePath)
                break;
            case 'ts':
            case 'js':
                DataIngestor.dataMap[filePath] = extractTSHtmlBlock(filePath);
                DataIngestor.directoryParser.createMirrorFile(filePath)
                break;
            default:
                console.log(`Unsupported file type: ${fileExtension}`);
        }
    }

    public static processPathmap(pathmap: any) {
        fs.writeFileSync(DataIngestor.mirrorMap, JSON.stringify(DataIngestor.dataMap, null, 2))
        for (const key in pathmap) {
            const value = pathmap[key];
            if (typeof value === 'string') {
                DataIngestor.ingestHtmlFile(value);
            } else if (typeof value === 'object') {
                DataIngestor.processPathmap(value);
            }
        }
    }
}

//// Initialize and process the path map
//DataIngestor.generatePathmap();
//DataIngestor.readPathMap(DataIngestor.directoryParser.filemap);
//DataIngestor.processPathmap(DataIngestor.pathMapContent);
//