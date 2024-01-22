import * as fs from 'fs';
import * as path from 'path';
import DataIngestor from './DataIngestor';

export class DirectoryParser {
    paths: string[];
    filemap: string;
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
        const originalContent = fs.readFileSync(originalFilePath, 'utf8');
        const fileName = path.basename(originalFilePath);
        const mirrorFilePath = path.join(this.mirrorDirectory, fileName);

        if (!fs.existsSync(this.mirrorDirectory)) {
            fs.mkdirSync(this.mirrorDirectory, { recursive: true });
        }

        fs.writeFileSync(mirrorFilePath, originalContent);
        this.mirrorFilePath = mirrorFilePath;
        return this.mirrorFilePath;
    }
}


