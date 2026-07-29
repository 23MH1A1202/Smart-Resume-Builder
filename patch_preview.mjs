import fs from 'fs';

let code = fs.readFileSync('src/components/ResumePreview.tsx', 'utf-8');

const regex = /\{data\.certifications && data\.certifications\.length > 0 && \([\s\S]*?\}\)[\s\S]*?<\/section>\s*\}/g;

let matchCount = 0;
code = code.replace(regex, (match) => {
    matchCount++;
    
    // Extract the section class and h2 class from the original match to preserve template styling somewhat
    let sectionMatch = match.match(/<section([^>]*)>/);
    let sectionClass = sectionMatch ? sectionMatch[1] : '';
    
    let h2Match = match.match(/<h2([^>]*)>(.*?)<\/h2>/);
    let h2Class = h2Match ? h2Match[1] : '';
    
    // Just force the left align for h2
    h2Class = h2Class.replace(/text-center/g, 'text-left');
    
    return `{data.certifications && data.certifications.length > 0 && (
        <section${sectionClass}>
          <h2${h2Class}>Certifications</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.certifications.map((cert, i) => (
              <div key={i} className="text-[13px] md:text-sm">
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && <span className="text-neutral-700"> ({cert.issuer})</span>}
                {cert.date && <span className="text-neutral-500 font-medium"> - {cert.date}</span>}
                {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-1">Link</a>}
                {i < data.certifications.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Workshops */}
      {data.workshops && data.workshops.length > 0 && (
        <section${sectionClass}>
          <h2${h2Class}>Workshops</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.workshops.map((ws, i) => (
              <div key={i} className="text-[13px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium"> - {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic"> ({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}`;
});

console.log('Replaced', matchCount, 'occurrences of certifications.');

fs.writeFileSync('src/components/ResumePreview.tsx', code);
