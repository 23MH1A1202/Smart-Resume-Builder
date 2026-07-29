import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf-8');

const printStyles = `
@media print {
  body * {
    visibility: hidden;
  }
  #print-section, #print-section * {
    visibility: visible;
  }
  #print-section {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
    margin: 0;
    padding: 0;
    box-shadow: none;
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
