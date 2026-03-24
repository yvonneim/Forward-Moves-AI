export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  techStack: string[];
  postedDate: string;
  description: string;
  url: string;
  companyUrl: string;
  swot?: SWOTAnalysis;
}

export interface ResumeMatch {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  tips: string[];
  summary: string;
}

export interface InterviewPrep {
  questions: {
    question: string;
    suggestedAnswer: string;
    whyTheyAsk: string;
  }[];
  companyCulture: string;
  strategicAdvice: string[];
}

export interface CoverLetter {
  content: string;
  keyPointsHighlighted: string[];
}

export interface RevisedResume {
  content: string;
  revisions: {
    section: string;
    change: string;
    reason: string;
  }[];
  suggestedKeywords: string[];
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}
