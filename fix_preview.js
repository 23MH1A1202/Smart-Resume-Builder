const fs = require('fs');

let content = fs.readFileSync('src/components/ResumePreview.tsx', 'utf8');

// Replace Languages
content = content.replace(
  /\{data\.languages\.join\(' • '\)\}/g,
  "{data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}"
);

// We need to carefully replace the declaration section in each template.
// Wait, the declaration templates are slightly different. I'll use regex to match them.
// Let's use `multi_edit_file` instead, it is safer.
