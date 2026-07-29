export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  gradeOrMarks?: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Workshop {
  id: string;
  name: string;
  organizer: string;
  date: string;
  location?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface DeclarationConfig {
  text: string;
  showDate: boolean;
  showPlace: boolean;
  showSignature: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  workshops: Workshop[];
  declaration: DeclarationConfig;
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
  workshops: [],
  declaration: {
    text: '',
    showDate: false,
    showPlace: false,
    showSignature: false
  }
};

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'janedoe.com',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe'
  },
  summary: 'A highly motivated Software Engineer with 5+ years of experience in designing and developing scalable web applications. Adept at leveraging modern JavaScript frameworks (React, Node.js) and cloud technologies to drive business impact. Passionate about writing clean, maintainable code and mentoring junior developers.',
  experience: [
    {
      id: 'exp1',
      company: 'TechCorp Solutions',
      position: 'Senior Frontend Engineer',
      startDate: 'Jan 2021',
      endDate: 'Present',
      location: 'Remote',
      description: '- Architected and built a high-performance e-commerce platform using Next.js and Tailwind CSS, increasing conversion rates by 15%.\n- Led a team of 4 frontend developers to migrate legacy AngularJS codebase to React.\n- Implemented CI/CD pipelines using GitHub Actions to automate testing and deployment processes, reducing deployment time by 40%.'
    },
    {
      id: 'exp2',
      company: 'Innovate Systems',
      position: 'Software Developer',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      location: 'New York, NY',
      description: '- Developed RESTful APIs using Node.js and Express to support a mobile application with over 100k active users.\n- Optimized MongoDB queries, resulting in a 30% reduction in database latency.\n- Integrated third-party payment gateways like Stripe to process over $1M in monthly transactions.'
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: 'Aug 2014',
      endDate: 'May 2018',
      location: 'Berkeley, CA',
      gradeOrMarks: '3.8 GPA'
    }
  ],
  projects: [
    {
      id: 'proj1',
      name: 'TaskMaster Pro',
      link: 'https://taskmaster.dev',
      description: 'A full-stack productivity application featuring real-time collaborative boards and AI-powered task prioritization. Built with React, Firebase, and Groq API.'
    }
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript (ES6+)', level: 'Advanced' },
    { id: 'skill2', name: 'TypeScript', level: 'Advanced' },
    { id: 'skill3', name: 'React', level: 'Advanced' },
    { id: 'skill4', name: 'Node.js', level: 'Intermediate' },
    { id: 'skill5', name: 'Tailwind CSS', level: 'Intermediate' },
    { id: 'skill6', name: 'PostgreSQL', level: 'Intermediate' },
    { id: 'skill7', name: 'Docker', level: 'Familiar' }
  ],
  languages: [
    { id: 'lang1', name: 'English', proficiency: 'Native' },
    { id: 'lang2', name: 'Spanish', proficiency: 'Conversational' }
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: 'May 2023',
      link: 'https://aws.amazon.com'
    }
  ],
  workshops: [
    {
      id: 'work1',
      name: 'Advanced React Patterns',
      organizer: 'Frontend Masters',
      date: 'Sep 2022'
    }
  ],
  declaration: {
    text: 'I hereby declare that all the above-furnished information is true and correct to the best of my knowledge and belief.',
    showDate: true,
    showPlace: true,
    showSignature: true
  }
};

export type TemplateId = 'modern' | 'minimal' | 'executive' | 'creative' | 'tech' | 'classic';

export interface AppState {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (template: TemplateId) => void;
  coverLetter: string;
  setCoverLetter: (letter: string) => void;
}
