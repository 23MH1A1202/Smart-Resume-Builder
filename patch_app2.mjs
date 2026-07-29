import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf-8');

const printStyles = `
@media print {
  body * {
    visibility: hidden;
  }
  body, html {
    margin: 0;
    padding: 0;
    height: auto;
  }
  #print-section, #print-section * {
    visibility: visible;
  }
  #print-section {
    position: relative !important;
    left: 0;
    top: 0;
    width: 210mm !important;
    margin: 0 !important;
    padding: 0;
    box-shadow: none;
    transform: none !important;
  }
  @page {
    size: A4;
    margin: 10mm;
  }
  .break-inside-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
`;

code = code.replace(/@media print \{[\s\S]*\}\s*\}/, printStyles);
fs.writeFileSync('src/index.css', code);
