import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { defaultResumeData, sampleResumeData, ResumeData, TemplateId } from './types';
import { FileText, LayoutTemplate, Briefcase, FileSignature, Download, History, X, Trash2 } from 'lucide-react';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import CoverLetterGen from './components/CoverLetterGen';
import { useReactToPrint } from 'react-to-print';
import { Toaster } from 'react-hot-toast';
import { getHistory, saveToHistory, removeFromHistory, HistoryItem } from './lib/storage';
import { isResumeEmpty, isResumeValid } from './utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'cover-letter'>('editor');
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [coverLetter, setCoverLetter] = useState<string>('');
  
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [printTitle, setPrintTitle] = useState('Resume');
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState('');

  const printRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const previewData = isResumeEmpty(resumeData) ? sampleResumeData : resumeData;

  useEffect(() => {
    setHistoryItems(getHistory());
  }, [showHistory]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width;
        // Padding on sides is approx 64px (32px each side) + some safety margin
        const padding = 64; 
        const targetWidth = availableWidth - padding;
        const scale = Math.max(0.2, Math.min(1, targetWidth / 794)); // 794px is approx 210mm
        setPreviewScale(scale);
      }
    });

    if (previewContainerRef.current) {
      resizeObserver.observe(previewContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [activeTab]); // re-evaluate when tab changes

  const handlePrintAction = useReactToPrint({
    contentRef: printRef,
    documentTitle: printTitle,
  });

  const handlePrint = () => {
    const defaultName = resumeData.personalInfo.fullName ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '')}-Resume` : 'Resume';
    setDownloadFileName(defaultName);
    setShowPrintDialog(true);
  };

  const executePrint = (e: React.FormEvent) => {
    e.preventDefault();
    setPrintTitle(downloadFileName || 'Resume');
    setShowPrintDialog(false);
    setTimeout(() => {
      handlePrintAction();
    }, 100);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setResumeData(item.data);
    setShowHistory(false);
    setActiveTab('editor');
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromHistory(id);
    setHistoryItems(getHistory());
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col">
      <Toaster position="bottom-center" />
      <header className="bg-white border-b border-neutral-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-neutral-900 text-white p-1.5 md:p-2 rounded-lg">
            <FileText size={20} className="md:w-6 md:h-6" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight hidden sm:block">Smart Resume Builder</h1>
          <h1 className="text-lg font-semibold tracking-tight sm:hidden">Smart Resume</h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-full border border-neutral-200">
            {[
              { id: 'editor', label: 'Editor', icon: <FileSignature size={16} /> },
              { id: 'cover-letter', label: 'Cover Letter', icon: <Briefcase size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  (activeTab === tab.id || (activeTab === 'preview' && tab.id === 'editor')) ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center justify-center gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium hover:bg-neutral-200 transition-all shadow-sm active:scale-95 border border-neutral-200"
          >
            <History size={16} />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Mobile Tabs */}
        <div className="md:hidden flex bg-white border-b border-neutral-200 overflow-x-auto">
          {[
            { id: 'editor', label: 'Editor' },
            { id: 'preview', label: 'Preview' },
            { id: 'cover-letter', label: 'Cover Letter' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={`flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-8 ${activeTab !== 'preview' ? 'block' : 'hidden md:block'}`}>
          <div className="max-w-3xl mx-auto h-full">
            <AnimatePresence mode="wait">
              {(activeTab === 'editor' || activeTab === 'preview') && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ResumeEditor
                    data={resumeData}
                    onChange={setResumeData}
                    onNext={() => {
                      saveToHistory(resumeData);
                      setActiveTab('preview');
                    }}
                  />
                </motion.div>
              )}
              {activeTab === 'cover-letter' && (
                <motion.div
                  key="cover-letter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CoverLetterGen
                    resumeData={resumeData}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    coverLetter={coverLetter}
                    setCoverLetter={setCoverLetter}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={`w-full md:w-[600px] lg:w-[800px] border-l border-neutral-200 bg-neutral-100 flex flex-col ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
          <div className="p-4 bg-white border-b border-neutral-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-500 shrink-0">Style:</span>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}
                className="text-sm bg-neutral-100 border border-neutral-200 rounded-md px-3 py-1.5 font-medium outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="executive">Executive</option>
                <option value="creative">Creative</option>
                <option value="tech">Tech</option>
                <option value="classic">Classic</option>
              </select>
            </div>
            <button
              onClick={() => handlePrint()}
              disabled={!isResumeValid(resumeData)}
              title={!isResumeValid(resumeData) ? "Required: Full name, phone, email, location, and at least one education." : "Download PDF"}
              className={`flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium transition-colors shadow-sm shrink-0 ${!isResumeValid(resumeData) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'}`}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
          <div ref={previewContainerRef} className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-neutral-200/50 print:p-0 print:bg-white print:block">
            <div 
              className="relative shrink-0 print:!w-auto print:!h-auto"
              style={{ 
                width: `${794 * previewScale}px`, 
                minHeight: `${1122 * previewScale}px` 
              }}
            >
              <div 
                id="print-section" 
                className="bg-white shadow-xl origin-top-left print:m-0 print:shadow-none print:!transform-none"
                style={{ 
                  width: '210mm', 
                  minHeight: '297mm',
                  transform: `scale(${previewScale})`
                }}
              >
                <ResumePreview ref={printRef} data={previewData} template={selectedTemplate} />
                {isResumeEmpty(resumeData) && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-50 print:hidden">
                    <div className="transform -rotate-45 text-[120px] font-black text-black/10 select-none whitespace-nowrap tracking-widest">
                      SAMPLE
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-neutral-500 text-center gap-4">
        <p className="font-medium text-neutral-600">© {new Date().getFullYear()} Smart Resume Builder.</p>
        <div className="flex flex-wrap justify-center items-center gap-3 font-medium">
          <span className="text-neutral-600">Built by <a href="https://alsagar.tech" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">Lalitha Sagar Ambati</a></span>
          <span className="text-neutral-300">|</span>
          <a href="mailto:lalithasagarambati@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">Email</a>
          <span className="text-neutral-300">|</span>
          <a href="https://github.com/23MH1A1202" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">GitHub</a>
        </div>
      </footer>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <History size={20} className="text-neutral-500" />
                  Resume History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {historyItems.length === 0 ? (
                  <div className="text-center py-12">
                    <History size={48} className="mx-auto text-neutral-200 mb-3" />
                    <p className="text-neutral-500 font-medium">No saved resumes yet.</p>
                    <p className="text-sm text-neutral-400 mt-1">Generated resumes will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="group flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:shadow-md cursor-pointer transition-all bg-white"
                      >
                        <div>
                          <h3 className="font-medium text-neutral-900">{item.name}</h3>
                          <p className="text-xs text-neutral-500 mt-1">
                            {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteHistoryItem(e, item.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Name Modal */}
      <AnimatePresence>
        {showPrintDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrintDialog(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <form onSubmit={executePrint}>
                <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                    <Download size={20} className="text-neutral-500" />
                    Download PDF
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowPrintDialog(false)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <label htmlFor="filename" className="block text-sm font-medium text-neutral-700 mb-2">
                    File Name
                  </label>
                  <input
                    id="filename"
                    type="text"
                    value={downloadFileName}
                    onChange={(e) => setDownloadFileName(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                    placeholder="Enter file name..."
                    autoFocus
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    .pdf will be appended automatically depending on your browser.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPrintDialog(false)}
                    className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download
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
