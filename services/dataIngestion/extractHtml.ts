import * as cheerio from 'cheerio';
import * as fs from 'fs';

export function extractHtml(filePath: string) {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    // Example: Finding all divs and adding a class
    $('div').addClass('new-class');

    // Log or return the modified HTML
    return $.html()

}

// Example usage
//processHtmlFile('path/to/angular/template.html');
