import React, { useState, useRef } from 'react';
import { ResumeData, defaultResumeData } from '../types';
import { isResumeEmpty } from '../utils';
import { Upload, FileType2, Loader2, Wand2, Plus, Trash2, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  onNext?: () => void;
}

export default function ResumeEditor({ data, onChange, onNext }: ResumeEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [targetSinglePage, setTargetSinglePage] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeSection, setActiveSection] = useState<'personalInfo' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'workshops' | 'languages'>('personalInfo');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit. Please upload a smaller PDF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadedFileName(file.name);
    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        let errMsg = 'Failed to parse resume';
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errData = await res.json();
          errMsg = errData.error?.message || errData.error || errMsg;
        } else {
          errMsg = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errMsg);
      }
      const parsedData = await res.json();
      if (parsedData.personalInfo) {
        onChange((prev: any) => ({
          ...prev,
          ...parsedData,
          personalInfo: { ...prev.personalInfo, ...(parsedData.personalInfo || {}) },
          experience: parsedData.experience || prev.experience || [],
          education: parsedData.education || prev.education || [],
          projects: parsedData.projects || prev.projects || [],
          skills: parsedData.skills || prev.skills || [],
          languages: parsedData.languages || prev.languages || [],
          certifications: parsedData.certifications || prev.certifications || [],
          workshops: parsedData.workshops || prev.workshops || [],
          declaration: parsedData.declaration || prev.declaration || { text: '', showDate: true, showPlace: true, showSignature: true }
        }));
        toast.success("Please verify every field before generating the resume.", { duration: 5000 });
      }
    } catch (err: any) {
      console.error('Failed to parse resume:', err);
      let errMsg = err.message;
      if (errMsg.includes('429') || errMsg.includes('Quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "AI service quota exceeded. Please wait a moment and try again.";
      }
      toast.error(`Parsing failed: ${errMsg}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleOptimize = async () => {
    if (!jobDescription) {
      toast.error("Please enter a job description in the 'AI Tailoring' section below before optimizing.");
      return;
    }
    
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, jobDescription, targetSinglePage })
      });
      
      if (!res.ok) {
        let errMsg = 'Failed to optimize resume';
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errData = await res.json();
          errMsg = errData.error?.message || errData.error || errMsg;
        } else {
          errMsg = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errMsg);
      }

      const optimized = await res.json();
      if (optimized.summary) {
        onChange(optimized);
        toast.success('Resume optimized successfully!');
      }
    } catch(err: any) {
      console.error(err);
      let errMsg = err.message;
      if (errMsg.includes('429') || errMsg.includes('Quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "AI service quota exceeded. Please wait a moment and try again.";
      }
      toast.error(`Optimization failed: ${errMsg}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-full relative">
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl border border-neutral-100 max-w-sm text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-blue-500 text-white p-4 rounded-full">
                  <FileText size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Parsing Resume...</h3>
              <p className="text-sm text-neutral-500 mt-2">Our AI is extracting your details from the PDF. This may take a moment.</p>
            </div>
          </motion.div>
        )}
        {isOptimizing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl border border-neutral-100 max-w-sm text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-indigo-500 text-white p-4 rounded-full">
                  <Wand2 size={32} className="animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Optimizing for ATS...</h3>
              <p className="text-sm text-neutral-500 mt-2">Tailoring your experience to match the job description. Hang tight!</p>
            </div>
          </motion.div>
        )}
        
        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Clear All Fields?</h3>
              <p className="text-sm text-neutral-500 mb-6">
                Are you sure you want to clear all fields? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onChange(defaultResumeData);
                    setJobDescription('');
                    setUploadedFileName(null);
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Resume Content</h2>
          <p className="text-sm text-neutral-500">Edit manually or upload an existing resume to auto-fill.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {uploadedFileName && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 mr-2">
              <FileType2 size={16} className="text-blue-600 shrink-0" />
              <span className="text-sm font-medium text-blue-900 max-w-[150px] truncate" title={uploadedFileName}>
                {uploadedFileName}
              </span>
              <button
                onClick={() => setUploadedFileName(null)}
                className="ml-1 text-blue-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-100 flex-shrink-0"
                title="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <input 
            type="file" 
            accept="application/pdf" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !!uploadedFileName}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors text-neutral-700 disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isUploading ? 'Parsing...' : 'Upload PDF'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          
          {/* AI Tailoring */}
          

          {/* Personal Info */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold border-b border-neutral-200 pb-2">Personal Information</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={data.personalInfo.fullName} 
                  onChange={e => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  value={data.personalInfo.email} 
                  onChange={e => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="rahul@gmail.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Phone <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  value={data.personalInfo.phone} 
                  onChange={e => updatePersonalInfo('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Location <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={data.personalInfo.location} 
                  onChange={e => updatePersonalInfo('location', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="Mumbai, MH"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">LinkedIn</label>
                <input 
                  type="url" 
                  value={data.personalInfo.linkedin} 
                  onChange={e => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="linkedin.com/in/rahulsharma"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">GitHub</label>
                <input 
                  type="url" 
                  value={data.personalInfo.github} 
                  onChange={e => updatePersonalInfo('github', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="github.com/rahulsharma"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Website / Portfolio</label>
                <input 
                  type="url" 
                  value={data.personalInfo.website} 
                  onChange={e => updatePersonalInfo('website', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="rahulsharma.dev"
                />
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          <section className="space-y-4">
             <h3 className="text-base font-semibold border-b border-neutral-200 pb-2">Professional Summary</h3>
             <textarea 
               value={data.summary}
               onChange={e => onChange(prev => ({ ...prev, summary: e.target.value }))}
               className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm min-h-[100px] resize-y"
               placeholder="A brief overview of your professional background and key achievements..."
             />
          </section>

          {/* Experience */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Experience</h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    experience: [...prev.experience, { id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', location: '', description: '' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Experience
                </button>
             </div>
             
             <AnimatePresence>
                {data.experience.map((exp, index) => (
                  <motion.div 
                    key={exp.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-neutral-700">Role {index + 1}</h4>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          experience: prev.experience.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Company</label>
                        <input 
                          type="text" 
                          value={exp.company} 
                          onChange={e => {
                            const newExp = [...data.experience];
                            newExp[index].company = e.target.value;
                            onChange(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Position</label>
                        <input 
                          type="text" 
                          value={exp.position} 
                          onChange={e => {
                            const newExp = [...data.experience];
                            newExp[index].position = e.target.value;
                            onChange(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                           <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Start Date</label>
                           <input 
                             type="text" 
                             value={exp.startDate} 
                             onChange={e => {
                               const newExp = [...data.experience];
                               newExp[index].startDate = e.target.value;
                               onChange(prev => ({ ...prev, experience: newExp }));
                             }}
                             className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                             placeholder="MMM YYYY"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">End Date</label>
                           <input 
                             type="text" 
                             value={exp.endDate} 
                             onChange={e => {
                               const newExp = [...data.experience];
                               newExp[index].endDate = e.target.value;
                               onChange(prev => ({ ...prev, experience: newExp }));
                             }}
                             className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                             placeholder="Present"
                           />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Location</label>
                        <input 
                          type="text" 
                          value={exp.location} 
                          onChange={e => {
                            const newExp = [...data.experience];
                            newExp[index].location = e.target.value;
                            onChange(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Description (Supports multiple lines for bullet points)</label>
                      <textarea 
                        value={exp.description} 
                        onChange={e => {
                          const newExp = [...data.experience];
                          newExp[index].description = e.target.value;
                          onChange(prev => ({ ...prev, experience: newExp }));
                        }}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm min-h-[100px] resize-y"
                      />
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>

          {/* Education */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Education <span className="text-red-500 text-sm">*</span></h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    education: [...prev.education, { id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', location: '', gradeOrMarks: '' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Education
                </button>
             </div>
             
             <AnimatePresence>
                {data.education.map((edu, index) => (
                  <motion.div 
                    key={edu.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-neutral-700">Education {index + 1}</h4>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          education: prev.education.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Institution</label>
                        <input 
                          type="text" 
                          value={edu.institution} 
                          onChange={e => {
                            const newEdu = [...data.education];
                            newEdu[index].institution = e.target.value;
                            onChange(prev => ({ ...prev, education: newEdu }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Degree</label>
                          <input 
                            type="text" 
                            value={edu.degree} 
                            onChange={e => {
                              const newEdu = [...data.education];
                              newEdu[index].degree = e.target.value;
                              onChange(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                            placeholder="B.Tech"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Field of Study</label>
                          <input 
                            type="text" 
                            value={edu.fieldOfStudy} 
                            onChange={e => {
                              const newEdu = [...data.education];
                              newEdu[index].fieldOfStudy = e.target.value;
                              onChange(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                            placeholder="Computer Science"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                           <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Start Date</label>
                           <input 
                             type="text" 
                             value={edu.startDate} 
                             onChange={e => {
                               const newEdu = [...data.education];
                               newEdu[index].startDate = e.target.value;
                               onChange(prev => ({ ...prev, education: newEdu }));
                             }}
                             className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                             placeholder="2019"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">End Date</label>
                           <input 
                             type="text" 
                             value={edu.endDate} 
                             onChange={e => {
                               const newEdu = [...data.education];
                               newEdu[index].endDate = e.target.value;
                               onChange(prev => ({ ...prev, education: newEdu }));
                             }}
                             className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                             placeholder="2023"
                           />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Location</label>
                          <input 
                            type="text" 
                            value={edu.location} 
                            onChange={e => {
                              const newEdu = [...data.education];
                              newEdu[index].location = e.target.value;
                              onChange(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Grade/Marks</label>
                          <input 
                            type="text" 
                            value={edu.gradeOrMarks || ''} 
                            onChange={e => {
                              const newEdu = [...data.education];
                              newEdu[index].gradeOrMarks = e.target.value;
                              onChange(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                            placeholder="8.5 CGPA"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>

          {/* Projects */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Projects</h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    projects: [...prev.projects, { id: crypto.randomUUID(), name: '', link: '', description: '' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Project
                </button>
             </div>
             
             <AnimatePresence>
                {data.projects.map((proj, index) => (
                  <motion.div 
                    key={proj.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-neutral-700">Project {index + 1}</h4>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          projects: prev.projects.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Project Name</label>
                        <input 
                          type="text" 
                          value={proj.name} 
                          onChange={e => {
                            const newProj = [...data.projects];
                            newProj[index].name = e.target.value;
                            onChange(prev => ({ ...prev, projects: newProj }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Link (Optional)</label>
                        <input 
                          type="url" 
                          value={proj.link} 
                          onChange={e => {
                            const newProj = [...data.projects];
                            newProj[index].link = e.target.value;
                            onChange(prev => ({ ...prev, projects: newProj }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Description</label>
                      <textarea 
                        value={proj.description} 
                        onChange={e => {
                          const newProj = [...data.projects];
                          newProj[index].description = e.target.value;
                          onChange(prev => ({ ...prev, projects: newProj }));
                        }}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm min-h-[80px] resize-y"
                      />
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>

          {/* Skills */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Skills</h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    skills: [...(prev.skills || []), { id: crypto.randomUUID(), name: '', level: 'Intermediate' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Skill
                </button>
             </div>
             
             <AnimatePresence>
                {(data.skills || []).map((skill, index) => (
                  <motion.div 
                    key={skill.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={skill.name} 
                          onChange={e => {
                            const newSkills = [...data.skills];
                            newSkills[index].name = e.target.value;
                            onChange(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                          placeholder="e.g. React"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <select
                          value={skill.level}
                          onChange={e => {
                            const newSkills = [...data.skills];
                            newSkills[index].level = e.target.value;
                            onChange(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="w-full appearance-none px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm cursor-pointer"
                        >
                          <option value="Expert">Expert</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Familiar">Familiar</option>
                          <option value="Beginner">Beginner</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>

          {/* Certifications */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Certifications</h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    certifications: [...(prev.certifications || []), { id: crypto.randomUUID(), name: '', issuer: '', date: '', link: '' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Certification
                </button>
             </div>
             
             <AnimatePresence>
                {(data.certifications || []).map((cert, index) => (
                  <motion.div 
                    key={cert.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-neutral-700">Certification {index + 1}</h4>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          certifications: prev.certifications.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Certification Name</label>
                        <input 
                          type="text" 
                          value={cert.name} 
                          onChange={e => {
                            const newCert = [...data.certifications];
                            newCert[index].name = e.target.value;
                            onChange(prev => ({ ...prev, certifications: newCert }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Issuer</label>
                        <input 
                          type="text" 
                          value={cert.issuer} 
                          onChange={e => {
                            const newCert = [...data.certifications];
                            newCert[index].issuer = e.target.value;
                            onChange(prev => ({ ...prev, certifications: newCert }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Date</label>
                        <input 
                          type="text" 
                          value={cert.date} 
                          onChange={e => {
                            const newCert = [...data.certifications];
                            newCert[index].date = e.target.value;
                            onChange(prev => ({ ...prev, certifications: newCert }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                          placeholder="e.g. May 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Link (Optional)</label>
                        <input 
                          type="url" 
                          value={cert.link || ''} 
                          onChange={e => {
                            const newCert = [...data.certifications];
                            newCert[index].link = e.target.value;
                            onChange(prev => ({ ...prev, certifications: newCert }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>

          {/* Workshops */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Workshops</h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    workshops: [...(prev.workshops || []), { id: crypto.randomUUID(), name: '', organizer: '', date: '', location: '' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Workshop
                </button>
             </div>
             
             <AnimatePresence>
                {(data.workshops || []).map((workshop, index) => (
                  <motion.div 
                    key={workshop.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-neutral-700">Workshop {index + 1}</h4>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          workshops: prev.workshops.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Workshop Name</label>
                        <input 
                          type="text" 
                          value={workshop.name} 
                          onChange={e => {
                            const newWs = [...(data.workshops || [])];
                            newWs[index].name = e.target.value;
                            onChange(prev => ({ ...prev, workshops: newWs }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Organizer</label>
                        <input 
                          type="text" 
                          value={workshop.organizer} 
                          onChange={e => {
                            const newWs = [...(data.workshops || [])];
                            newWs[index].organizer = e.target.value;
                            onChange(prev => ({ ...prev, workshops: newWs }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Date</label>
                        <input 
                          type="text" 
                          value={workshop.date} 
                          onChange={e => {
                            const newWs = [...(data.workshops || [])];
                            newWs[index].date = e.target.value;
                            onChange(prev => ({ ...prev, workshops: newWs }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                          placeholder="e.g. May 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Location (Optional)</label>
                        <input 
                          type="text" 
                          value={workshop.location || ''} 
                          onChange={e => {
                            const newWs = [...(data.workshops || [])];
                            newWs[index].location = e.target.value;
                            onChange(prev => ({ ...prev, workshops: newWs }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>
          {/* Languages */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Languages</h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    languages: [...prev.languages, { id: crypto.randomUUID(), name: '', proficiency: 'Conversational' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Language
                </button>
             </div>
             
             <AnimatePresence>
                {data.languages.map((lang, index) => (
                  <motion.div 
                    key={lang.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={lang.name} 
                          onChange={e => {
                            const newLangs = [...data.languages];
                            newLangs[index].name = e.target.value;
                            onChange(prev => ({ ...prev, languages: newLangs }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                          placeholder="e.g. English"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <select
                          value={lang.proficiency}
                          onChange={e => {
                            const newLangs = [...data.languages];
                            newLangs[index].proficiency = e.target.value;
                            onChange(prev => ({ ...prev, languages: newLangs }));
                          }}
                          className="w-full appearance-none px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm cursor-pointer"
                        >
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Professional">Professional</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Beginner">Beginner</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          languages: prev.languages.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>

          {/* Declaration */}
          <section className="space-y-4">
             <h3 className="text-base font-semibold border-b border-neutral-200 pb-2">Declaration</h3>
             <textarea 
               value={data.declaration.text}
               onChange={e => onChange(prev => ({ ...prev, declaration: { ...prev.declaration, text: e.target.value } }))}
               className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm min-h-[80px]"
               placeholder="I hereby declare that all the above-furnished information is true and correct to the best of my knowledge and belief."
             />
             <div className="flex flex-wrap gap-4 mt-2">
               <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={data.declaration.showDate}
                   onChange={e => onChange(prev => ({ ...prev, declaration: { ...prev.declaration, showDate: e.target.checked } }))}
                   className="rounded text-neutral-900 focus:ring-neutral-900"
                 />
                 Include Date
               </label>
               <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={data.declaration.showPlace}
                   onChange={e => onChange(prev => ({ ...prev, declaration: { ...prev.declaration, showPlace: e.target.checked } }))}
                   className="rounded text-neutral-900 focus:ring-neutral-900"
                 />
                 Include Place
               </label>
               <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={data.declaration.showSignature}
                   onChange={e => onChange(prev => ({ ...prev, declaration: { ...prev.declaration, showSignature: e.target.checked } }))}
                   className="rounded text-neutral-900 focus:ring-neutral-900"
                 />
                 Include Signature Line
               </label>
             </div>
          </section>

          <section className="space-y-4 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
             <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-3">
               <div>
                 <h3 className="text-base font-semibold text-blue-900 flex items-center gap-2">
                   <Wand2 size={18} className="text-blue-600" /> 
                   AI ATS Tailoring
                 </h3>
                 <p className="text-xs text-blue-700 mt-1">Paste the job description below to optimize your resume content for ATS.</p>
               </div>
               <button
                 onClick={handleOptimize}
                 disabled={isOptimizing}
                 className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shrink-0 disabled:opacity-50"
               >
                 {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                 {isOptimizing ? 'Optimizing...' : 'Optimize Resume'}
               </button>
             </div>
             <textarea 
               value={jobDescription}
               onChange={e => setJobDescription(e.target.value)}
               className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm min-h-[100px] resize-y"
               placeholder="Paste the job description here..."
             />
          
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
          </section>
          {onNext && (
            <div className="pt-6 border-t border-neutral-200 flex justify-between items-center">
              <button
                onClick={() => {
                  if (isResumeEmpty(data)) {
                    toast("There is nothing to clear.", { icon: "ℹ️" });
                  } else {
                    setShowClearConfirm(true);
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
                Clear All
              </button>
              <button
                onClick={() => {
                  const isValid = data.personalInfo.fullName.trim() !== '' && 
                                  data.personalInfo.phone.trim() !== '' && 
                                  data.personalInfo.email.trim() !== '' && 
                                  data.personalInfo.location.trim() !== '' && 
                                  data.education.length > 0;
                  if (!isValid) {
                    toast.error("Please fill in the mandatory fields, or upload the sample Resume", { duration: 5000 });
                  } else {
                    onNext();
                  }
                }}
                className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-all shadow-sm"
              >
                Generate Resume
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
