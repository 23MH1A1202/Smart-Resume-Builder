import fs from 'fs';
let code = fs.readFileSync('src/components/ResumePreview.tsx', 'utf-8');

// replace skills.join 
code = code.replace(/\{data\.skills\.join\(' • '\)\}/g, "{data.skills.map(s => `${s.name}${s.level && s.level !== 'Familiar' && s.level !== 'Beginner' ? ` (${s.level})` : ''}`).join(' • ')}");
code = code.replace(/\{data\.skills\.join\(' \| '\)\}/g, "{data.skills.map(s => `${s.name}${s.level && s.level !== 'Familiar' && s.level !== 'Beginner' ? ` (${s.level})` : ''}`).join(' | ')}");
code = code.replace(/\{data\.skills\.join\(', '\)\}/g, "{data.skills.map(s => `${s.name}${s.level && s.level !== 'Familiar' && s.level !== 'Beginner' ? ` (${s.level})` : ''}`).join(', ')}");

// replace skills.map for chips
code = code.replace(/\{data\.skills\.map\(\(skill, i\) => \([\s\S]*?<span[^>]*>\s*\{skill\}\s*<\/span>[\s\S]*?\}\)\}/g, (match) => {
    return match.replace(/{skill}/g, "{skill.name}");
});

fs.writeFileSync('src/components/ResumePreview.tsx', code);
