import React, { forwardRef } from 'react';
import { ResumeData, TemplateId } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateId;
}

const Linkify = ({ text }: { text: string }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a key={i} href={part} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

const ModernTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans text-neutral-800 p-10 h-full bg-white">
    {/* Header */}
    <header className="border-b-2 border-neutral-900 pb-6 mb-6">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-2">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
        {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">{data.personalInfo.email}</a>}
        {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        {data.personalInfo.linkedin && <span className="flex gap-1">• <a href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.website && <span className="flex gap-1">• <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.github && <span className="flex gap-1">• <a href={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
      </div>
    </header>

    <div className="grid grid-cols-1 gap-6">
      {/* Summary */}
      {data.summary && (
        <section className="break-inside-avoid mb-6">
          <p className="text-sm leading-relaxed text-neutral-700">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-neutral-900">{exp.position}</h3>
                  <span className="text-sm font-medium text-neutral-500 whitespace-nowrap">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-medium text-neutral-700">{exp.company}</span>
                  <span className="text-sm text-neutral-500 italic">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 text-sm text-neutral-700 space-y-1">
                  {exp.description.split('\n').filter(Boolean).map((point, j) => (
                    <li key={j} className="leading-relaxed"><Linkify text={point.replace(/^[•\-\*]\s*/, '')} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-neutral-900">{edu.institution}</h3>
                  <span className="text-sm font-medium text-neutral-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-neutral-700">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-sm text-neutral-500 italic">{edu.location}</span>
                </div>
                {edu.gradeOrMarks && (
                  <div className="text-sm text-neutral-600 mt-0.5">
                    <span className="font-medium">Grade/Marks:</span> {edu.gradeOrMarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-neutral-900">{proj.name}</h3>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">{proj.link}</a>}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Skills</h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {data.skills.map(s => `${s.name}${s.level && s.level !== 'Familiar' && s.level !== 'Beginner' ? ` (${s.level})` : ''}`).join(' • ')}
          </p>
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Languages</h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Certifications</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
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
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Workshops</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.workshops.map((ws, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium ml-1">- {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic ml-1">({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Declaration */}
      {data.declaration && data.declaration.text && (
        <section className="break-inside-avoid mb-6 mt-8 pt-8 border-t border-neutral-300">
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
      )}
    </div>
  </div>
);

const MinimalTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans text-neutral-800 p-10 h-full bg-white ">
    {/* Clean centered header */}
    <header className="text-left mb-8">
      <h1 className="text-3xl font-light tracking-widest text-neutral-900 mb-3">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-neutral-500 uppercase tracking-wider">
        {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">{data.personalInfo.email}</a>}
        {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
        {data.personalInfo.website && <span className="flex gap-1">| <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.linkedin && <span className="flex gap-1">| <a href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.github && <span className="flex gap-1">| <a href={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
      </div>
    </header>

    <div className="space-y-6">
      {data.summary && (
        <p className="text-sm text-neutral-600 text-left max-w-2xl mx-auto leading-relaxed">{data.summary}</p>
      )}

      {data.experience.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 text-left">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid grid grid-cols-4 gap-4">
                <div className="col-span-1 text-right text-xs text-neutral-500 pt-1">
                  {exp.startDate} - {exp.endDate}
                </div>
                <div className="col-span-3">
                  <h3 className="font-medium text-neutral-900">{exp.position}</h3>
                  <div className="text-sm text-neutral-500 mb-2">{exp.company}</div>
                  <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap space-y-1">
                     {exp.description.split('\n').filter(Boolean).map((point, j) => (
                        <p key={j} className="relative pl-3 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-neutral-300 before:rounded-full">
                          <Linkify text={point.replace(/^[•\-\*]\s*/, '')} />
                        </p>
                     ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 text-left mt-6">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="break-inside-avoid text-left">
                <h3 className="font-medium text-neutral-900 text-sm">{edu.institution}</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <div className="text-xs text-neutral-500 mt-1 flex justify-center gap-2">
                  <span>{edu.startDate} - {edu.endDate}</span>
                  {edu.gradeOrMarks && (
                    <>
                      <span>|</span>
                      <span>{edu.gradeOrMarks}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 text-left mt-6">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i} className="break-inside-avoid text-left">
                <h3 className="font-medium text-neutral-900 text-sm">
                  {proj.name}
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-neutral-500 ml-2 hover:text-neutral-700 italic">Link</a>}
                </h3>
                <p className="text-sm text-neutral-600 mt-1 max-w-2xl mx-auto">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 text-left mt-8">Technical Skills</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-neutral-50 text-neutral-600 text-xs rounded-full border border-neutral-100">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3 text-left mt-6">Languages</h2>
          <p className="text-sm text-neutral-600 text-left">
            {data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}
          </p>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 text-left mt-6">Certifications</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
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
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 text-left mt-6">Workshops</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.workshops.map((ws, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium ml-1">- {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic ml-1">({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.declaration && data.declaration.text && (
        <section className="break-inside-avoid mb-6 mt-12 pt-8 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 leading-relaxed text-left max-w-2xl mx-auto italic mb-10">"{data.declaration.text}"</p>
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
      )}
    </div>
  </div>
);


const ExecutiveTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans text-neutral-900 p-12 h-full bg-[#FAFAFA] border-8 border-double border-neutral-200">
    <header className="text-left border-b border-neutral-400 pb-6 mb-6">
      <h1 className="text-4xl font-normal tracking-wide text-neutral-900 mb-4 uppercase">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <div className="flex justify-center flex-wrap gap-4 text-sm text-neutral-600 font-sans">
        {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">{data.personalInfo.email}</a>}
        {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        {data.personalInfo.website && <span className="flex gap-1">• <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.linkedin && <span className="flex gap-1">• <a href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.github && <span className="flex gap-1">• <a href={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
      </div>
    </header>
    <div className="space-y-6">
      {data.summary && (
        <p className="text-[15px] leading-relaxed text-justify text-neutral-800">{data.summary}</p>
      )}
      {data.experience.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-normal uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4">Professional Experience</h2>
          <div className="space-y-5">
            {data.experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-lg text-neutral-900">{exp.position}</h3>
                  <span className="text-sm font-medium text-neutral-600 font-sans whitespace-nowrap">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-base text-neutral-800 font-medium">{exp.company}</span>
                  <span className="text-sm text-neutral-600 italic font-sans">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-5 text-[15px] text-neutral-800 space-y-1 font-sans">
                  {exp.description.split('\n').filter(Boolean).map((point, j) => (
                    <li key={j} className="leading-relaxed"><Linkify text={point.replace(/^[•\-\*]\s*/, '')} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.education.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-normal uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4 mt-6">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-lg text-neutral-900">{edu.institution}</h3>
                  <span className="text-sm font-medium text-neutral-600 font-sans">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-base text-neutral-800">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-sm text-neutral-600 italic font-sans">{edu.location}</span>
                </div>
                {edu.gradeOrMarks && (
                  <div className="text-[15px] text-neutral-700 font-sans mt-0.5">
                    <span className="font-medium">Grade/Marks:</span> {edu.gradeOrMarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.projects.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-normal uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4 mt-6">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-lg text-neutral-900">{proj.name}</h3>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-sm text-neutral-600 font-sans italic hover:underline">{proj.link}</a>}
                </div>
                <p className="text-[15px] leading-relaxed text-neutral-800 font-sans">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.skills.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-normal uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4 mt-6">Skills</h2>
          <p className="text-[15px] text-neutral-800 leading-relaxed font-sans">
            {data.skills.map(s => `${s.name}${s.level && s.level !== 'Familiar' && s.level !== 'Beginner' ? ` (${s.level})` : ''}`).join(' • ')}
          </p>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-normal uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4 mt-6">Languages</h2>
          <p className="text-[15px] text-neutral-800 leading-relaxed font-sans">
            {data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}
          </p>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-normal uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4 mt-6">Certifications</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
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
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-normal uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-4 mt-6">Workshops</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.workshops.map((ws, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium ml-1">- {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic ml-1">({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.declaration && data.declaration.text && (
        <section className="break-inside-avoid mb-6 mt-10 pt-8 border-t border-neutral-300">
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
      )}
    </div>
  </div>
);

const CreativeTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans text-neutral-800 p-10 h-full bg-white">
    <header className="bg-indigo-600 text-white p-8 -mx-10 -mt-10 mb-8">
      <h1 className="text-4xl font-bold tracking-tight mb-2">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-indigo-100">
        {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="hover:text-white">{data.personalInfo.email}</a>}
        {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        {data.personalInfo.website && <span className="flex gap-1">• <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:text-white">{data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.linkedin && <span className="flex gap-1">• <a href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-white">{data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.github && <span className="flex gap-1">• <a href={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:text-white">{data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
      </div>
    </header>

    <div className="space-y-6">
      {data.summary && (
        <section className="break-inside-avoid mb-6">
          <p className="text-lg leading-relaxed text-neutral-700 italic border-l-4 border-indigo-200 pl-4">
            {data.summary}
          </p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-200"></span>
            Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-neutral-900">{exp.position}</h3>
                  <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-base text-indigo-600 font-medium mb-2">
                  {exp.company} <span className="text-neutral-400 font-normal italic ml-1">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 text-sm text-neutral-700 space-y-1">
                  {exp.description.split('\n').filter(Boolean).map((point, j) => (
                    <li key={j} className="leading-relaxed"><Linkify text={point.replace(/^[•\-\*]\s*/, '')} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-200"></span>
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-neutral-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <span className="text-sm font-medium text-neutral-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-base text-indigo-600 font-medium">
                  {edu.institution} <span className="text-neutral-400 font-normal italic ml-1">{edu.location}</span>
                </div>
                {edu.gradeOrMarks && (
                  <div className="text-sm text-neutral-600 mt-1">
                    <span className="font-medium">Grade/Marks:</span> {edu.gradeOrMarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-200"></span>
            Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.projects.map((proj, i) => (
              <div key={i} className="break-inside-avoid border border-neutral-200 p-4 rounded-lg bg-neutral-50">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-bold text-neutral-900">{proj.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700 mb-2">{proj.description}</p>
                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">View Project &rarr;</a>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {(data.skills.length > 0 || data.languages.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.skills.length > 0 && (
            <section className="break-inside-avoid mb-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-indigo-200"></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.languages.length > 0 && (
            <section className="break-inside-avoid mb-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-indigo-200"></span>
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <span key={i} className="bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-1 rounded text-sm">
                    {lang.name} <span className="text-neutral-400 ml-1">{lang.proficiency}</span>
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-200"></span>
            Certifications
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
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
        <section className="break-inside-avoid mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-200"></span>
            Workshops
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.workshops.map((ws, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium ml-1">- {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic ml-1">({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.declaration && data.declaration.text && (
        <section className="break-inside-avoid mb-6 mt-12 pt-8 border-t border-indigo-100">
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
      )}
    </div>
  </div>
);

const TechTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans text-neutral-900 p-10 h-full bg-white">
    <header className="border-b-4 border-black pb-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
        {data.personalInfo.email && <span>Email: <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">{data.personalInfo.email}</a></span>}
        {data.personalInfo.phone && <span>Tel: {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>Loc: {data.personalInfo.location}</span>}
        {data.personalInfo.github && <span>GitHub: <a href={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.linkedin && <span>LinkedIn: <a href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.website && <span>Web: <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
      </div>
    </header>

    <div className="space-y-6">
      {data.summary && (
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-2">Summary</div>
          <p className="text-sm leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Experience</div>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline border-b border-dashed border-neutral-300 mb-2 pb-1">
                  <h3 className="font-bold text-base">{exp.position} @ {exp.company}</h3>
                  <span className="text-sm">[{exp.startDate} – {exp.endDate}]</span>
                </div>
                <div className="text-sm italic mb-2 text-neutral-600">Location: {exp.location}</div>
                <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                  {exp.description.split('\n').filter(Boolean).map((point, j) => (
                    <li key={j} className="leading-relaxed"><Linkify text={point.replace(/^[•\-\*]\s*/, '')} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Education</div>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1 border-b border-dashed border-neutral-300 pb-1">
                  <h3 className="font-bold text-base">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <span className="text-sm">[{edu.startDate} – {edu.endDate}]</span>
                </div>
                <div className="text-sm font-medium">
                  {edu.institution} <span className="text-neutral-500 font-normal italic ml-2">{edu.location}</span>
                </div>
                {edu.gradeOrMarks && (
                  <div className="text-sm mt-1 text-neutral-700">
                    <span className="font-bold">GPA/Marks:</span> {edu.gradeOrMarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Projects</div>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">&gt; {proj.name}</h3>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-sm underline">Link</a>}
                </div>
                <p className="text-sm leading-relaxed ml-4">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.skills.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-2">Skills</div>
          <p className="text-sm leading-relaxed">
            {data.skills.map(s => `${s.name}${s.level && s.level !== 'Familiar' && s.level !== 'Beginner' ? ` (${s.level})` : ''}`).join(' | ')}
          </p>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-2">Languages</div>
          <p className="text-sm leading-relaxed">
            {data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' | ')}
          </p>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Certifications</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
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
        <section className="break-inside-avoid mb-6">
          <div className="bg-black text-white px-2 py-1 inline-block font-bold uppercase text-sm mb-4">Workshops</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.workshops.map((ws, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium ml-1">- {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic ml-1">({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.declaration && data.declaration.text && (
        <section className="break-inside-avoid mb-6 mt-8 pt-8 border-t-2 border-dashed border-black">
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
      )}
    </div>
  </div>
);

const ClassicTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans text-black p-10 h-full bg-white">
    <header className="text-left mb-6 border-b-2 border-black pb-4">
      <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm">
        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
        {data.personalInfo.email && <span>• <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">{data.personalInfo.email}</a></span>}
        {data.personalInfo.linkedin && <span>• <a href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.github && <span>• <a href={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        {data.personalInfo.website && <span>• <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
      </div>
    </header>

    <div className="space-y-4">
      {data.summary && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2">Professional Summary</h2>
          <p className="text-[15px] leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2 mt-4">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px]">{exp.company}</h3>
                  <span className="text-sm font-bold">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="italic text-[15px]">{exp.position}</span>
                  <span className="text-sm italic">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                  {exp.description.split('\n').filter(Boolean).map((point, j) => (
                    <li key={j} className="leading-relaxed text-justify"><Linkify text={point.replace(/^[•\-\*]\s*/, '')} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2 mt-4">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px]">{edu.institution}</h3>
                  <span className="text-sm font-bold">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="italic text-[15px]">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-sm italic">{edu.location}</span>
                </div>
                {edu.gradeOrMarks && (
                  <div className="text-sm">
                    <span className="font-bold">Grade/Marks:</span> {edu.gradeOrMarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2 mt-4">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px]">{proj.name}</h3>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-sm italic hover:underline">Link</a>}
                </div>
                <p className="text-sm leading-relaxed text-justify">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.skills.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2 mt-4">Skills</h2>
          <p className="text-sm leading-relaxed text-left">
            {data.skills.map(s => `${s.name}${s.level && s.level !== 'Familiar' && s.level !== 'Beginner' ? ` (${s.level})` : ''}`).join(', ')}
          </p>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2 mt-4">Languages</h2>
          <p className="text-sm leading-relaxed text-left">
            {data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
          </p>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2 mt-4">Certifications</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
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
        <section className="break-inside-avoid mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-2 mt-4">Workshops</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {data.workshops.map((ws, i) => (
              <div key={i} className="break-inside-avoid text-[13.5px] md:text-sm">
                <span className="font-bold">{ws.name}</span>
                {ws.organizer && <span className="text-neutral-700"> ({ws.organizer})</span>}
                {ws.date && <span className="text-neutral-500 font-medium ml-1">- {ws.date}</span>}
                {ws.location && <span className="text-neutral-500 italic ml-1">({ws.location})</span>}
                {i < data.workshops.length - 1 && <span className="text-neutral-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.declaration && data.declaration.text && (
        <section className="break-inside-avoid mb-6 mt-8 pt-6 border-t border-black">
          <h2 className="text-lg font-bold uppercase tracking-widest text-left mb-4">Declaration</h2>
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
      )}
    </div>
  </div>
);

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, template }, ref) => {
  return (
    <div ref={ref} className="w-full h-full">
      {template === 'modern' && <ModernTemplate data={data} />}
      {template === 'minimal' && <MinimalTemplate data={data} />}
      {template === 'executive' && <ExecutiveTemplate data={data} />}
      {template === 'creative' && <CreativeTemplate data={data} />}
      {template === 'tech' && <TechTemplate data={data} />}
      {template === 'classic' && <ClassicTemplate data={data} />}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
