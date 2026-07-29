import { ResumeData } from './types';

export const isResumeEmpty = (data: ResumeData) => {
  return (
    !data.personalInfo.fullName &&
    !data.personalInfo.email &&
    !data.summary &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.projects.length === 0 &&
    data.skills.length === 0 &&
    data.languages.length === 0 &&
    (data.certifications?.length === 0 || !data.certifications) &&
    (!data.declaration?.text)
  );
};

export const isResumeValid = (data: ResumeData) => {
  return (
    data.personalInfo.fullName.trim() !== '' &&
    data.personalInfo.phone.trim() !== '' &&
    data.personalInfo.email.trim() !== '' &&
    data.personalInfo.location.trim() !== '' &&
    data.education.length > 0
  );
};
