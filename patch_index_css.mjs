import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf-8');
code = code.replace(/position: absolute;/g, '');
code = code.replace(/left: 0;/g, '');
code = code.replace(/top: 0;/g, '');
fs.writeFileSync('src/index.css', code);
