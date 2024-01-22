import DataIngestor from './dataIngestion/DataIngestor';
import { DirectoryParser } from './dataIngestion/DirectoryParser';
import * as fs from 'fs';
import { replace_target } from './replaceHtml';

const dparser = new DirectoryParser()
dparser.setIgnorePaths()
dparser.walkFolder('tests/testPlace/')
dparser.writeStructureToFile('tests/testPlace/')

DataIngestor.generatePathmap('tests/testPlace/')
DataIngestor.readPathMap(DataIngestor.directoryParser.filemap);
DataIngestor.processPathmap(DataIngestor.pathMapContent);

const data = DataIngestor.dataMap
for (const key in data) {
    const value = data[key];
    if (typeof value === 'string') {
        (async () => {
            const htmlResponse = await replace_target(value).catch(err => console.log(err))
            if (htmlResponse) {
                fs.writeFileSync(key, htmlResponse)
            }
        })()
    }
}