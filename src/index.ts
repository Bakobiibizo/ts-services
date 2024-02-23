import DataIngestor from './data-Ingestor/DataIngestor';
import { DirectoryParser } from './data-Ingestor/DirectoryParser';
import * as fs from 'fs';
import { replace_target } from './replaceHtml';

const dparser = new DirectoryParser()
const targetPath = 'D:/ts-services/tests/testPlace/src/app'
dparser.setIgnorePaths()
dparser.walkFolder(targetPath)
dparser.writeStructureToFile(targetPath)

DataIngestor.generatePathmap(targetPath)
DataIngestor.readPathMap(DataIngestor.directoryParser.filemap);
DataIngestor.processPathmap(DataIngestor.pathMapContent);

const data = DataIngestor.dataMap
for (const key in data) {
    const value = data[key];
    if (typeof value === 'string') {
        (async () => {
            const htmlResponse = await replace_target(value).catch(err => console.log(err))
            if (htmlResponse) {
                const newValue = value.replace(value, htmlResponse)
                fs.writeFileSync(key, newValue)
            }
        })()
    }
}