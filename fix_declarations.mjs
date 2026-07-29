import fs from 'fs';

let content = fs.readFileSync('src/components/ResumePreview.tsx', 'utf8');

// Modern
content = content.replace(
  /\{data\.declaration && \([\s\S]*?<section className="mt-8 pt-8 border-t border-neutral-300">[\s\S]*?<p className="text-sm text-neutral-700 leading-relaxed text-justify mb-8">\{data\.declaration\}<\/p>[\s\S]*?<div className="flex justify-between items-end mt-4">[\s\S]*?<div>[\s\S]*?<p className="text-sm text-neutral-700 font-bold mb-1">Date: \{new Date\(\)\.toLocaleDateString\(\)\}<\/p>[\s\S]*?<p className="text-sm text-neutral-700 font-bold">Place: \{data\.personalInfo\.location \|\| '________________'\}<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="text-right flex flex-col items-end">[\s\S]*?<div className="h-10 border-b border-neutral-900 w-40 mb-2"><\/div>[\s\S]*?<p className="text-sm text-neutral-900 font-bold">\(\{data\.personalInfo\.fullName \|\| 'YOUR NAME'\}\)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>[\s\S]*?\)}/,
  `{data.declaration && data.declaration.text && (
        <section className="mt-8 pt-8 border-t border-neutral-300">
          <p className="text-sm text-neutral-700 leading-relaxed text-justify mb-8">{data.declaration.text}</p>
          {(data.declaration.showDate || data.declaration.showPlace || data.declaration.showSignature) && (
            <div className="flex justify-between items-end mt-4">
              <div>
                {data.declaration.showDate && <p className="text-sm text-neutral-700 font-bold mb-1">Date: {new Date().toLocaleDateString()}</p>}
                {data.declaration.showPlace && <p className="text-sm text-neutral-700 font-bold">Place: {data.personalInfo.location || '________________'}</p>}
              </div>
              {data.declaration.showSignature && (
                <div className="text-right flex flex-col items-end">
                  <div className="h-10 border-b border-neutral-900 w-40 mb-2"></div>
                  <p className="text-sm text-neutral-900 font-bold">({data.personalInfo.fullName || 'YOUR NAME'})</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}`
);

// Minimal
content = content.replace(
  /\{data\.declaration && \([\s\S]*?<section className="mt-12 pt-8 border-t border-neutral-100">[\s\S]*?<p className="text-xs text-neutral-500 leading-relaxed text-center max-w-2xl mx-auto italic mb-10">"\{data\.declaration\}"<\/p>[\s\S]*?<div className="flex justify-between items-end px-4">[\s\S]*?<div className="text-xs text-neutral-500">[\s\S]*?<p className="mb-1">Date: \{new Date\(\)\.toLocaleDateString\(\)\}<\/p>[\s\S]*?<p>Place: \{data\.personalInfo\.location \|\| '________________'\}<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="text-right flex flex-col items-center">[\s\S]*?<div className="h-8 border-b border-neutral-400 w-32 mb-2"><\/div>[\s\S]*?<p className="text-xs text-neutral-600 font-medium">\(\{data\.personalInfo\.fullName \|\| 'YOUR NAME'\}\)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>[\s\S]*?\)}/,
  `{data.declaration && data.declaration.text && (
        <section className="mt-12 pt-8 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 leading-relaxed text-center max-w-2xl mx-auto italic mb-10">"{data.declaration.text}"</p>
          {(data.declaration.showDate || data.declaration.showPlace || data.declaration.showSignature) && (
            <div className="flex justify-between items-end px-4">
              <div className="text-xs text-neutral-500">
                {data.declaration.showDate && <p className="mb-1">Date: {new Date().toLocaleDateString()}</p>}
                {data.declaration.showPlace && <p>Place: {data.personalInfo.location || '________________'}</p>}
              </div>
              {data.declaration.showSignature && (
                <div className="text-right flex flex-col items-center">
                  <div className="h-8 border-b border-neutral-400 w-32 mb-2"></div>
                  <p className="text-xs text-neutral-600 font-medium">({data.personalInfo.fullName || 'YOUR NAME'})</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}`
);

// Executive
content = content.replace(
  /\{data\.declaration && \([\s\S]*?<section className="mt-10 pt-8 border-t border-neutral-300">[\s\S]*?<p className="text-\[15px\] leading-relaxed text-justify text-neutral-800 font-sans mb-10">\{data\.declaration\}<\/p>[\s\S]*?<div className="flex justify-between items-end">[\s\S]*?<div className="font-sans">[\s\S]*?<p className="text-sm text-neutral-800 font-medium mb-1">Date: \{new Date\(\)\.toLocaleDateString\(\)\}<\/p>[\s\S]*?<p className="text-sm text-neutral-800 font-medium">Place: \{data\.personalInfo\.location \|\| '________________'\}<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="text-right flex flex-col items-center">[\s\S]*?<div className="h-12 border-b border-neutral-800 w-48 mb-2"><\/div>[\s\S]*?<p className="text-base text-neutral-900 font-semibold uppercase tracking-wider">\(\{data\.personalInfo\.fullName \|\| 'YOUR NAME'\}\)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>[\s\S]*?\)}/,
  `{data.declaration && data.declaration.text && (
        <section className="mt-10 pt-8 border-t border-neutral-300">
          <p className="text-[15px] leading-relaxed text-justify text-neutral-800 font-sans mb-10">{data.declaration.text}</p>
          {(data.declaration.showDate || data.declaration.showPlace || data.declaration.showSignature) && (
            <div className="flex justify-between items-end">
              <div className="font-sans">
                {data.declaration.showDate && <p className="text-sm text-neutral-800 font-medium mb-1">Date: {new Date().toLocaleDateString()}</p>}
                {data.declaration.showPlace && <p className="text-sm text-neutral-800 font-medium">Place: {data.personalInfo.location || '________________'}</p>}
              </div>
              {data.declaration.showSignature && (
                <div className="text-right flex flex-col items-center">
                  <div className="h-12 border-b border-neutral-800 w-48 mb-2"></div>
                  <p className="text-base text-neutral-900 font-semibold uppercase tracking-wider">({data.personalInfo.fullName || 'YOUR NAME'})</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}`
);

// Tech
content = content.replace(
  /\{data\.declaration && \([\s\S]*?<section className="mt-12 pt-8 border-t border-indigo-100">[\s\S]*?<div className="bg-indigo-50\/50 p-6 rounded-lg border border-indigo-100">[\s\S]*?<p className="text-sm leading-relaxed text-neutral-700 italic mb-8">"\{data\.declaration\}"<\/p>[\s\S]*?<div className="flex justify-between items-end mt-4">[\s\S]*?<div>[\s\S]*?<p className="text-sm text-indigo-900 font-semibold mb-1">Date: \{new Date\(\)\.toLocaleDateString\(\)\}<\/p>[\s\S]*?<p className="text-sm text-indigo-900 font-semibold">Place: \{data\.personalInfo\.location \|\| '________________'\}<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="text-right flex flex-col items-end">[\s\S]*?<div className="h-10 border-b-2 border-indigo-300 w-40 mb-2"><\/div>[\s\S]*?<p className="text-sm text-indigo-900 font-bold">\(\{data\.personalInfo\.fullName \|\| 'YOUR NAME'\}\)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>[\s\S]*?\)}/,
  `{data.declaration && data.declaration.text && (
        <section className="mt-12 pt-8 border-t border-indigo-100">
          <div className="bg-indigo-50/50 p-6 rounded-lg border border-indigo-100">
            <p className="text-sm leading-relaxed text-neutral-700 italic mb-8">"{data.declaration.text}"</p>
            {(data.declaration.showDate || data.declaration.showPlace || data.declaration.showSignature) && (
              <div className="flex justify-between items-end mt-4">
                <div>
                  {data.declaration.showDate && <p className="text-sm text-indigo-900 font-semibold mb-1">Date: {new Date().toLocaleDateString()}</p>}
                  {data.declaration.showPlace && <p className="text-sm text-indigo-900 font-semibold">Place: {data.personalInfo.location || '________________'}</p>}
                </div>
                {data.declaration.showSignature && (
                  <div className="text-right flex flex-col items-end">
                    <div className="h-10 border-b-2 border-indigo-300 w-40 mb-2"></div>
                    <p className="text-sm text-indigo-900 font-bold">({data.personalInfo.fullName || 'YOUR NAME'})</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}`
);

// Creative
content = content.replace(
  /\{data\.declaration && \([\s\S]*?<section className="mt-8 pt-8 border-t-2 border-dashed border-black">[\s\S]*?<div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Declaration<\/div>[\s\S]*?<p className="text-sm leading-relaxed text-justify mb-8">\{data\.declaration\}<\/p>[\s\S]*?<div className="flex justify-between items-end mt-4">[\s\S]*?<div>[\s\S]*?<p className="text-sm font-bold mb-1">&gt; DATE: \{new Date\(\)\.toLocaleDateString\(\)\}<\/p>[\s\S]*?<p className="text-sm font-bold">&gt; PLACE: \{data\.personalInfo\.location \? data\.personalInfo\.location\.toUpperCase\(\) : '________________'\}<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="text-right flex flex-col items-end">[\s\S]*?<div className="h-10 border-b-2 border-black w-40 mb-2"><\/div>[\s\S]*?<p className="text-sm font-bold uppercase">\(\{data\.personalInfo\.fullName \|\| 'YOUR NAME'\}\)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>[\s\S]*?\)}/,
  `{data.declaration && data.declaration.text && (
        <section className="mt-8 pt-8 border-t-2 border-dashed border-black">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Declaration</div>
          <p className="text-sm leading-relaxed text-justify mb-8">{data.declaration.text}</p>
          {(data.declaration.showDate || data.declaration.showPlace || data.declaration.showSignature) && (
            <div className="flex justify-between items-end mt-4">
              <div>
                {data.declaration.showDate && <p className="text-sm font-bold mb-1">&gt; DATE: {new Date().toLocaleDateString()}</p>}
                {data.declaration.showPlace && <p className="text-sm font-bold">&gt; PLACE: {data.personalInfo.location ? data.personalInfo.location.toUpperCase() : '________________'}</p>}
              </div>
              {data.declaration.showSignature && (
                <div className="text-right flex flex-col items-end">
                  <div className="h-10 border-b-2 border-black w-40 mb-2"></div>
                  <p className="text-sm font-bold uppercase">({data.personalInfo.fullName || 'YOUR NAME'})</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}`
);

// Classic
content = content.replace(
  /\{data\.declaration && \([\s\S]*?<section className="mt-8 pt-6 border-t border-black">[\s\S]*?<h2 className="text-lg font-bold uppercase tracking-widest text-center mb-4">Declaration<\/h2>[\s\S]*?<p className="text-\[15px\] leading-relaxed text-justify mb-10">\{data\.declaration\}<\/p>[\s\S]*?<div className="flex justify-between items-end">[\s\S]*?<div>[\s\S]*?<p className="text-sm font-bold mb-1">Date: \{new Date\(\)\.toLocaleDateString\(\)\}<\/p>[\s\S]*?<p className="text-sm font-bold">Place: \{data\.personalInfo\.location \|\| '________________'\}<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="text-right flex flex-col items-center">[\s\S]*?<div className="h-10 border-b border-black w-48 mb-2"><\/div>[\s\S]*?<p className="text-sm font-bold uppercase tracking-wider">\(\{data\.personalInfo\.fullName \|\| 'YOUR NAME'\}\)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>[\s\S]*?\)}/,
  `{data.declaration && data.declaration.text && (
        <section className="mt-8 pt-6 border-t border-black">
          <h2 className="text-lg font-bold uppercase tracking-widest text-center mb-4">Declaration</h2>
          <p className="text-[15px] leading-relaxed text-justify mb-10">{data.declaration.text}</p>
          {(data.declaration.showDate || data.declaration.showPlace || data.declaration.showSignature) && (
            <div className="flex justify-between items-end">
              <div>
                {data.declaration.showDate && <p className="text-sm font-bold mb-1">Date: {new Date().toLocaleDateString()}</p>}
                {data.declaration.showPlace && <p className="text-sm font-bold">Place: {data.personalInfo.location || '________________'}</p>}
              </div>
              {data.declaration.showSignature && (
                <div className="text-right flex flex-col items-center">
                  <div className="h-10 border-b border-black w-48 mb-2"></div>
                  <p className="text-sm font-bold uppercase tracking-wider">({data.personalInfo.fullName || 'YOUR NAME'})</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}`
);

fs.writeFileSync('src/components/ResumePreview.tsx', content);
