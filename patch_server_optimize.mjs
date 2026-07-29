import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const oldPrompt = `You are an expert ATS optimizer and resume writer. 
I have a JSON object representing a resume, and a job description. 
Optimize the resume summary, experience descriptions, and skills to better match the job description while keeping it 100% truthful and sounding human-written, not AI-generated.
Return ONLY valid JSON in the exact same format as the input.`;

const newPrompt = `You are an expert ATS optimizer and resume writer. 
I have a JSON object representing a resume, and a job description. 
Optimize the resume summary, experience descriptions, and skills to better match the job description while keeping it 100% truthful and sounding human-written, not AI-generated.
\${targetSinglePage ? 'The user requested a SINGLE-PAGE RESUME. Minimize the content aggressively by removing older or less relevant experience bullet points, truncating long descriptions, and focusing only on the most important details based on the job description. Keep it extremely concise but impactful.' : ''}
Return ONLY valid JSON in the exact same format as the input.`;

code = code.replace(oldPrompt, newPrompt);
code = code.replace('const { resumeData, jobDescription } = req.body;', 'const { resumeData, jobDescription, targetSinglePage } = req.body;');

fs.writeFileSync('server.ts', code);
