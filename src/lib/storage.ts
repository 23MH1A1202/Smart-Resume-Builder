import { ResumeData } from '../types';

const STORAGE_KEY = 'smart_resume_history';

export interface HistoryItem {
  id: string;
  date: string;
  name: string;
  data: ResumeData;
}

export const getHistory = (): HistoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveToHistory = (resumeData: ResumeData) => {
  if (!resumeData.personalInfo.fullName && resumeData.experience.length === 0 && resumeData.education.length === 0) return;
  
  const history = getHistory();
  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    name: resumeData.personalInfo.fullName || 'Untitled Resume',
    data: resumeData,
  };
  
  // keep last 10
  const updated = [newItem, ...history].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const removeFromHistory = (id: string) => {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
