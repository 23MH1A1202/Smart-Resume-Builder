import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

function render_page(pageData) {
    let render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false
    }
    return pageData.getTextContent(render_options)
    .then(function(textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY){
                text += item.str;
            } else{
                text += '\n' + item.str;
            }    
            lastY = item.transform[5];
        }
        return pageData.getAnnotations().then(function(annotations) {
            let links = annotations.filter(a => a.subtype === 'Link' && a.url).map(a => a.url);
            if (links.length > 0) {
               text += '\n\n--- EMBEDDED LINKS FOUND ON THIS PAGE ---\n' + links.join('\n') + '\n-----------------------------------------\n';
            }
            return text;
        });
    });
}

async function run() {
  const data = await pdfParse(fs.readFileSync('sample.pdf'), { pagerender: render_page }).catch(e => console.log(e.message));
  console.log(data.text);
}
// run();
