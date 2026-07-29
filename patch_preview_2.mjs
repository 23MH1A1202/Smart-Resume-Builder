import fs from 'fs';

let code = fs.readFileSync('src/components/ResumePreview.tsx', 'utf-8');

// The regex might not have matched because there could be nested divs. Let's do it per template.
// I can just replace the whole section by matching the start and carefully finding the end.
let replacedCount = 0;
while(true) {
  let startIndex = code.indexOf('{data.certifications && data.certifications.length > 0 && (');
  if (startIndex === -1) break;
  let endIndex = code.indexOf('</section>', startIndex);
  if (endIndex === -1) break;
  
  let endBraceIndex = code.indexOf('}', endIndex);
  if (endBraceIndex === -1) break;

  let block = code.substring(startIndex, endBraceIndex + 1);
  
  let sectionMatch = block.match(/<section([^>]*)>/);
  let sectionClass = sectionMatch ? sectionMatch[1] : '';
  
  let h2Match = block.match(/<h2([^>]*)>(.*?)<\/h2>/);
  let h2Class = h2Match ? h2Match[1] : '';
  h2Class = h2Class.replace(/text-center/g, 'text-left');
  
  let replacement = `{data.certifications && data.certifications.length > 0 && (
        <section${sectionClass}>
          <h2${h2Class}>Certifications</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="text-[13.5px] md:text-sm">
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && <span className="text-neutral-700"> ({cert.issuer})</span>}
                {cert.date && <span className="text-neutral-500 font-medium ml-1">- {cert.date}</span>}
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
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.workshops.map((ws, i) => (
              <div key={i} className="text-[13.5px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium ml-1">- {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic ml-1">({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}`;
      
  code = code.substring(0, startIndex) + replacement + code.substring(endBraceIndex + 1);
  replacedCount++;
  
  // replace `{data.certifications && data.certifications.length > 0 && (` with a temporary marker so we don't match it again
  code = code.replace('{data.certifications && data.certifications.length > 0 && (', '{/* CERTS_REPLACED */}');
}

code = code.replace(/\{\/\* CERTS_REPLACED \*\/\}/g, '{data.certifications && data.certifications.length > 0 && (');

console.log('Replaced', replacedCount, 'occurrences of certifications.');
fs.writeFileSync('src/components/ResumePreview.tsx', code);
