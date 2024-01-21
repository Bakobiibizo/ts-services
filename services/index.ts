import DataIngestor from './dataIngestion/DataIngestor';
import * as fs from 'fs';

const dataIngestor = new DataIngestor();

DataIngestor.generatePathmap('tests/testPlace/')
DataIngestor.readPathMap(DataIngestor.directoryParser.filemap);
DataIngestor.processPathmap(DataIngestor.pathMapContent);