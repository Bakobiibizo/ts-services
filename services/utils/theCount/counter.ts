import fs from "fs";

export type Count = {
    count: number 
    countFilesInDir: (directory: string) => number
}

export default class TheCount {
    count: number;
    constructor(count: number) {
        this.count = count;
    }
    public countFilesInDir(directory: string): number {
        if (!fs.existsSync(directory)) {
            return 0;
        }
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = `${directory}/${file}`;
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                this.count++;
            }
        }

        return this.count;
    }
}