import fs from 'fs';
let code = fs.readFileSync('src/components/ResumePreview.tsx', 'utf-8');

// Replace all <section> with <section className="break-inside-avoid">
// But wait, some sections already have classes!
code = code.replace(/<section>/g, '<section className="break-inside-avoid mb-6">');
code = code.replace(/<section className="([^"]+)">/g, (match, classes) => {
  if (classes.includes('break-inside-avoid')) return match;
  return `<section className="break-inside-avoid mb-6 ${classes}">`;
});

// Also add break-inside-avoid to mapped items
// experience items
code = code.replace(/<div key=\{i\}>/g, '<div key={i} className="break-inside-avoid mb-4">');
// Grid layouts might be messed up if we add mb-4, let's just add break-inside-avoid
code = code.replace(/<div key=\{i\} className="([^"]*)">/g, (match, classes) => {
  if (classes.includes('break-inside-avoid')) return match;
  return `<div key={i} className="break-inside-avoid ${classes}">`;
});

fs.writeFileSync('src/components/ResumePreview.tsx', code);
