import fs from 'fs';
let code = fs.readFileSync('src/components/ResumeEditor.tsx', 'utf-8');

// The AI optimize section starts with <section className="space-y-4 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
// Let's find it.
let startIndex = code.indexOf('<section className="space-y-4 bg-blue-50/50 p-5 rounded-xl border border-blue-100">');
if (startIndex !== -1) {
    let endIndex = code.indexOf('</section>', startIndex);
    let sectionCode = code.substring(startIndex, endIndex + 10);
    
    // Remove it from current location
    code = code.replace(sectionCode, '');
    
    // Add "Minimize to single page" checkbox option to state
    // We need to add state for this.
    const stateStr = "const [jobDescription, setJobDescription] = useState<string>('');";
    code = code.replace(stateStr, stateStr + '\n  const [targetSinglePage, setTargetSinglePage] = useState<boolean>(false);');
    
    // Modify handleOptimize to send this flag
    const optimizeCall = 'body: JSON.stringify({ resumeData: data, jobDescription: jobDescription })';
    code = code.replace(optimizeCall, 'body: JSON.stringify({ resumeData: data, jobDescription, targetSinglePage })');
    
    // Modify sectionCode to include the checkbox
    const newSectionCode = sectionCode.replace('placeholder="Paste the job description here..."', 'placeholder="Paste the job description here..."')
        .replace('</section>', `
             <div className="mt-3">
               <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={targetSinglePage}
                   onChange={e => setTargetSinglePage(e.target.checked)}
                   className="rounded text-blue-600 focus:ring-blue-500"
                 />
                 Optimize for single-page resume (Minimize huge content while keeping important details)
               </label>
             </div>
          </section>`);
          
    // Insert it at the bottom, before the generate buttons
    const beforeButtons = '{onNext && (';
    code = code.replace(beforeButtons, newSectionCode + '\n          ' + beforeButtons);
    
    fs.writeFileSync('src/components/ResumeEditor.tsx', code);
    console.log("Optimization section moved to bottom.");
} else {
    console.log("Could not find optimization section.");
}
