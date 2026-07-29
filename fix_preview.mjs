import fs from 'fs';

let content = fs.readFileSync('src/components/ResumePreview.tsx', 'utf8');

// Modern
content = content.replace(
  "{data.languages.join(' • ')}",
  "{data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}"
);

// Minimal
content = content.replace(
  "{data.languages.join(' • ')}",
  "{data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}"
);

// Executive
content = content.replace(
  "{data.languages.join(' • ')}",
  "{data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}"
);

// Tech
content = content.replace(
  "                {data.languages.map((lang, i) => (\n                  <span key={i} className=\"bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-1 rounded text-sm\">\n                    {lang}\n                  </span>\n                ))}",
  "                {data.languages.map((lang, i) => (\n                  <span key={i} className=\"bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-1 rounded text-sm\">\n                    {lang.name} <span className=\"text-neutral-400 ml-1\">{lang.proficiency}</span>\n                  </span>\n                ))}"
);

// Creative
content = content.replace(
  "{data.languages.join(' | ')}",
  "{data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' | ')}"
);

// Classic
content = content.replace(
  "{data.languages.join(', ')}",
  "{data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}"
);

fs.writeFileSync('src/components/ResumePreview.tsx', content);
