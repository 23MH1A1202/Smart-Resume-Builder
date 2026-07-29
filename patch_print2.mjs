import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf-8');

const printStyles = `
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }
  body, html {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    background: white !important;
  }
  #print-section {
    position: relative !important;
    width: 100% !important;
    max-width: 210mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-shadow: none !important;
    transform: none !important;
  }
  .break-inside-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
`;

code = code.replace(/@media print \{[\s\S]*\}\s*\}/, printStyles);
fs.writeFileSync('src/index.css', code);
