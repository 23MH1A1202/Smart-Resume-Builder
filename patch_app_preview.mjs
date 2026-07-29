import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The wrapper:
code = code.replace(
    /height: \`\$\{1122 \* previewScale\}px\`/g,
    'minHeight: `${1122 * previewScale}px`'
);

// The #print-section classes
code = code.replace(
    /className="bg-white shadow-xl origin-top-left absolute top-0 left-0 print:relative print:m-0 print:shadow-none print:!transform-none"/g,
    'className="bg-white shadow-xl origin-top-left print:m-0 print:shadow-none print:!transform-none"'
);

// To make transform scale work nicely without absolute, we can set transformOrigin and margin
// Actually, if we just remove absolute, it will flow.
// Let's add transform-origin: top left or origin-top-left.

fs.writeFileSync('src/App.tsx', code);
