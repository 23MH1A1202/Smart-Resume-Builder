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
  #print-section {
    position: absolute !important;
    left: 0;
    top: 0;
    width: 210mm !important;
    margin: 0 !important;
    padding: 0;
    box-shadow: none;
    transform: none !important;
  }
  #print-section, #print-section * {
    visibility: visible;
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

// Wait, absolute breaks pagination!
// If we use display:none on the elements outside #print-section, it's better.
