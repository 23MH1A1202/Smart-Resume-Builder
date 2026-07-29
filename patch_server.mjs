import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/"showDate": true/g, '"showDate": false');
code = code.replace(/"showPlace": true/g, '"showPlace": false');
code = code.replace(/"showSignature": true/g, '"showSignature": false');
fs.writeFileSync('server.ts', code);
