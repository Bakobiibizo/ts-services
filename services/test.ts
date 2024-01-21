import * as fs from 'fs';
let fullResponse = ""
let lines = fs.readFileSync('test.json', 'utf8').split('\n')
