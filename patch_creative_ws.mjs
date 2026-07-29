import fs from 'fs';
let code = fs.readFileSync('src/components/ResumePreview.tsx', 'utf-8');

// replace only the specific one. 
// We know it's right after Certifications in the block that has "text-indigo-600"
let lines = code.split('\n');
for (let i = 480; i < 700; i++) {
    if (lines[i] && lines[i].includes('<div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Workshops</div>')) {
        lines[i] = `          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">\n            <span className="w-6 h-0.5 bg-indigo-200"></span>\n            Workshops\n          </h2>`;
    }
}
fs.writeFileSync('src/components/ResumePreview.tsx', lines.join('\n'));
