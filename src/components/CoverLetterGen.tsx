import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Send, Loader2, Save, FileText, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface CoverLetterGenProps {
  resumeData: ResumeData;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  coverLetter: string;
  setCoverLetter: (letter: string) => void;
}

export default function CoverLetterGen({ resumeData, jobDescription, setJobDescription, coverLetter, setCoverLetter }: CoverLetterGenProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('professional');
  
  // Track to Google Sheets
  const [company, setCompany] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState('');

  const handleGenerate = async () => {
    if (!jobDescription) {
      toast.error("Please enter a job description first.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription, tone })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || errData.error || 'Failed to generate cover letter');
      }

      const data = await res.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message;
      if (errMsg.includes('429') || errMsg.includes('Quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "AI service quota exceeded. Please wait a moment and try again.";
      }
      toast.error(`Generation failed: ${errMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const executeTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spreadsheetId) {
      toast.error('Spreadsheet ID is required');
      return;
    }
    setShowTrackModal(false);

    setIsTracking(true);
    try {
      await fetch('/api/track-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId,
          company: company || 'Unknown Company',
          role: 'Unknown Role', // Could extract from job description
          date: new Date().toISOString().split('T')[0],
          status: 'Applied',
          notes: 'Auto-generated cover letter'
        })
      });
      toast.success('Application tracked to Google Sheets!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to track application');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-full relative">
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl border border-neutral-100 max-w-sm text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-neutral-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-neutral-900 text-white p-4 rounded-full">
                  <FileText size={32} className="animate-bounce" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Crafting Letter...</h3>
              <p className="text-sm text-neutral-500 mt-2">Writing a tailored, human-sounding cover letter based on your resume and job description.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Cover Letter Generator</h2>
          <p className="text-sm text-neutral-500">AI crafted letters tailored to the job description.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-700">1. Paste Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm min-h-[150px] resize-y"
            placeholder="Paste the requirements, responsibilities, and company information here..."
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full sm:flex-1 space-y-1">
             <label className="block text-sm font-medium text-neutral-700">2. Select Tone</label>
             <div className="relative">
               <select 
                 value={tone} 
                 onChange={(e) => setTone(e.target.value)}
                 className="w-full appearance-none px-4 py-2.5 pr-10 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all text-sm shadow-sm text-neutral-700 cursor-pointer hover:border-neutral-300 text-ellipsis overflow-hidden whitespace-nowrap"
               >
                 <option value="professional">🎯 Professional & Direct</option>
                 <option value="enthusiastic">✨ Enthusiastic & Passionate</option>
                 <option value="creative">🎨 Creative & Story-driven</option>
                 <option value="confident">🚀 Confident & Bold</option>
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             </div>
          </div>
          <div className="w-full sm:flex-1 h-full">
             <button
               onClick={handleGenerate}
               disabled={isGenerating || !jobDescription}
               className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
             >
               {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
               Generate Letter
             </button>
          </div>
        </div>

        {coverLetter && (
          <div className="pt-6 border-t border-neutral-200 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Generated Cover Letter
              </h3>
              
              <div className="flex items-center gap-2">
                 <input 
                   type="text" 
                   value={company} 
                   onChange={(e) => setCompany(e.target.value)}
                   placeholder="Company Name"
                   className="px-3 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                 />
                 <button
                   onClick={() => setShowTrackModal(true)}
                   disabled={isTracking || !company}
                   className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                 >
                   {isTracking ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                   Track in Sheets
                 </button>
              </div>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-xl p-6 prose prose-sm max-w-none text-neutral-800">
              <ReactMarkdown>{coverLetter}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
      
      {/* Sheets Track Modal */}
      <AnimatePresence>
        {showTrackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTrackModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <form onSubmit={executeTrackApplication}>
                <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                    <Save size={20} className="text-neutral-500" />
                    Google Sheets Sync
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowTrackModal(false)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <label htmlFor="sheetId" className="block text-sm font-medium text-neutral-700 mb-2">
                    Spreadsheet ID
                  </label>
                  <input
                    id="sheetId"
                    type="text"
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                    placeholder="Enter Spreadsheet ID..."
                    autoFocus
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    You can find this in the URL of your Google Sheet.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTrackModal(false)}
                    className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Save size={16} />
                    Sync
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
