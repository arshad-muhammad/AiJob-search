export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  targetJobTitles: string[];
  preferredLocations: string[];
  salaryRange: [number, number];
  remotePreference: string;
  visaSponsorshipNeeded: boolean;
  yearsOfExperience: number;
  extractedSkills: string[];
  resumeUrl?: string;
}

export interface JobListing {
  id: string;
  title: string;
  companyName: string;
  logoUrl?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  matchScore: number;
  postedDate: string;
  descriptionHtml: string;
  source: string;
  isApplied: boolean;
}

export interface TailoredDocs {
  originalResume: string;
  tailoredResume: string;
  coverLetter: string;
  questionsAndAnswers: { question: string; answer: string }[];
}

export type ApplicationStatus = 'Queued' | 'Reviewing' | 'Submitted' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  daysSinceSubmitted: number;
  lastActionDate: string;
  tailoredResumePreview?: string;
  coverLetterPreview?: string;
  timeline: { status: string; date: string }[];
}

export interface DashboardStats {
  totalApplied: number;
  responseRatePercent: number;
  interviews: number;
  offers: number;
}
