import * as fs from 'fs';
import * as path from 'path';
import { extractHtml } from './extractHtml';
import { extractJSX } from './extractJSX';
import { extractTSHtmlBlock } from './extractTSHTMLBlock';
import { extractPythonCode } from './extractPythonCode';
import { extractRustCode } from './extractRustCode';

export class DirectoryParser {
    paths: string[];
    filemap: string;
    dataMap: any;
    ignorepaths: string;
    dataFolder: string;
    fileIgnore: string[]
    mirrorFilePath: string
    mirrorDirectory: string
    constructor() {
        this.dataFolder = 'data';
        this.filemap = 'data/fileMap.json';
        this.ignorepaths = 'data/ignorepaths.txt';
        if (!fs.existsSync(this.dataFolder)) {
            fs.mkdirSync(this.dataFolder);
        }
        if (!fs.existsSync(this.filemap)) {
            fs.writeFileSync(this.filemap, '{}');
        }
        this.paths = [];
        this.fileIgnore = [];
        this.setIgnorePaths();
        this.mirrorFilePath = '';
        this.mirrorDirectory = 'data/mirror';
    }

    public async determineFiletype(filePath: string): Promise<void> {
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
                case 'py':
                    content = await extractPythonCode(filePath);
                    break;
                case 'rs':
                    content = await extractRustCode(filePath);
                    break;
                case 'json':
                case 'md':
                    content = fs.readFileSync(filePath, 'utf8');
                    break;
                default:
                    console.log(`Unsupported file type: ${fileExtension}`);
                    return;
            }
            
            this.dataMap[filePath] = content;
            this.createMirrorFile(filePath);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }

    public setIgnorePaths() {
        if (!fs.existsSync(this.ignorepaths)) {
            fs.writeFileSync(this.ignorepaths, '');
            return;
        }
        fs.readFileSync(this.ignorepaths, 'utf8').split('\n').forEach(line => {
            if (line) {
                this.fileIgnore.push(line.trim());
            }
        });
    }

    public addToIgnorePaths(pathToAdd: string) {
        this.fileIgnore.push(pathToAdd);
        fs.writeFileSync(this.ignorepaths, this.fileIgnore.join('\n'));
    }

    public removeFromIgnorePaths(pathToRemove: string) {
        this.fileIgnore = this.fileIgnore.filter(ignorePath => ignorePath !== pathToRemove);
        fs.writeFileSync(this.ignorepaths, this.fileIgnore.join('\n'));
    }

    private shouldIgnorePath(filePath: string): boolean {
        const normalizedPath = path.normalize(filePath);
        return this.fileIgnore.some(ignorePath =>
            normalizedPath.includes(path.normalize(ignorePath)) || normalizedPath === path.normalize(ignorePath));
    }

    public walkFolder(folder: string): any {
        let structure: any = {};
        for (const file of fs.readdirSync(folder)) {
            const filePath = path.join(folder, file);
            if (this.shouldIgnorePath(filePath)) {
                continue;
            }
            if (fs.statSync(filePath).isDirectory()) {
                structure[file] = this.walkFolder(filePath);
            } else {
                structure[file] = filePath;
            }
        }
        return structure;
    }

    public writeStructureToFile(folder: string) {
        const structure = this.walkFolder(folder);
        fs.writeFileSync(this.filemap, JSON.stringify(structure, null, 2));
    }

    public createMirrorFile(originalFilePath: string): string {
        try {
            const relativePath = path.relative(process.cwd(), originalFilePath);
            const mirrorPath = path.join(this.mirrorDirectory, relativePath);
            const mirrorDir = path.dirname(mirrorPath);

            if (!fs.existsSync(mirrorDir)) {
                fs.mkdirSync(mirrorDir, { recursive: true });
            }

            // Only copy the file if it exists and is not a directory
            if (fs.existsSync(originalFilePath) && !fs.statSync(originalFilePath).isDirectory()) {
                fs.copyFileSync(originalFilePath, mirrorPath);
            } else {
                // If it's a directory, just create the directory in the mirror
                if (!fs.existsSync(mirrorPath)) {
                    fs.mkdirSync(mirrorPath, { recursive: true });
                }
            }
            
            return mirrorPath;
        } catch (error) {
            console.error(`Error creating mirror file for ${originalFilePath}:`, error);
            return '';
        }
    }
}
