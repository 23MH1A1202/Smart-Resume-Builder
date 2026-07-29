import fs from 'fs';
let code = fs.readFileSync('src/components/ResumePreview.tsx', 'utf-8');

// The Creative template uses text-indigo-600. It starts around line 483:
// <div className="font-sans text-neutral-800 p-10 h-full bg-white">
// In that block, certifications and workshops need to have:
/*
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-200"></span>
            Certifications
          </h2>
*/
// I will just replace the specific lines 663 and 681.

const lines = code.split('\n');

if (lines[662].includes('Certifications')) {
    lines[662] = `          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">\n            <span className="w-6 h-0.5 bg-indigo-200"></span>\n            Certifications\n          </h2>`;
}
if (lines[679].includes('Workshops')) {
    lines[679] = `          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">\n            <span className="w-6 h-0.5 bg-indigo-200"></span>\n            Workshops\n          </h2>`;
}

fs.writeFileSync('src/components/ResumePreview.tsx', lines.join('\n'));
