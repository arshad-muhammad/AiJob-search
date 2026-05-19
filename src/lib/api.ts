import {
  Application,
  CandidateProfile,
  DashboardStats,
  JobListing,
  TailoredDocs,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // In a real app we would get the token from NextAuth/Zustand
  const token = localStorage.getItem('auth_token');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred while fetching data';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // Ignored
    }
    throw new ApiError(response.status, errorMsg);
  }

  if (response.status !== 204) {
    return response.json();
  }
}

export const api = {
  uploadResume: async (file: File): Promise<{ url: string; extractedSkills: string[] }> => {
    const formData = new FormData();
    formData.append('resume', file);
    // Mock response for preview
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: 'https://example.com/resume.pdf',
          extractedSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'AWS', 'Python']
        });
      }, 1500);
    });
    // return fetchWithAuth('/profile/resume', { method: 'POST', body: formData });
  },

  getProfile: async (): Promise<CandidateProfile | null> => {
    // Mock
    return {
      id: 'p1',
      userId: 'u1',
      targetJobTitles: ['Frontend Engineer', 'Fullstack Developer'],
      preferredLocations: ['New York', 'Remote'],
      salaryRange: [120000, 180000],
      remotePreference: 'remote_only',
      visaSponsorshipNeeded: false,
      yearsOfExperience: 5,
      extractedSkills: ['React', 'TypeScript', 'Tailwind'],
    };
    // return fetchWithAuth('/profile');
  },

  updateProfile: async (data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
    return fetchWithAuth('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getJobs: async (filters: any): Promise<JobListing[]> => {
    // Mock data for preview
    return [
      {
        id: 'j1',
        title: 'Senior Frontend Engineer',
        companyName: 'Acme Corp',
        location: 'Remote',
        salaryMin: 140000,
        salaryMax: 180000,
        salaryCurrency: 'USD',
        matchScore: 92,
        postedDate: new Date().toISOString(),
        descriptionHtml: '<h3>About the role</h3><p>We are looking for a senior frontend engineer...</p>',
        source: 'LinkedIn',
        isApplied: false,
      },
      {
        id: 'j2',
        title: 'Full Stack Engineer',
        companyName: 'TechNova',
        location: 'New York, NY',
        matchScore: 78,
        postedDate: new Date(Date.now() - 86400000).toISOString(),
        descriptionHtml: '<h3>About the role</h3><p>Join our fast-paced startup...</p>',
        source: 'Greenhouse',
        isApplied: false,
      },
      {
        id: 'j3',
        title: 'React Developer',
        companyName: 'Globex',
        location: 'San Francisco, CA',
        matchScore: 55,
        postedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        descriptionHtml: '<h3>About the role</h3><p>Looking for someone with 2 years of React...</p>',
        source: 'Indeed',
        isApplied: false,
      }
    ];
    // const searchParams = new URLSearchParams(filters);
    // return fetchWithAuth(`/jobs?${searchParams}`);
  },

  getJob: async (id: string): Promise<JobListing> => {
    // Mock data
    return {
      id,
      title: 'Senior Frontend Engineer',
      companyName: 'Acme Corp',
      location: 'Remote',
      salaryMin: 140000,
      salaryMax: 180000,
      salaryCurrency: 'USD',
      matchScore: 92,
      postedDate: new Date().toISOString(),
      descriptionHtml: `<h3>About the role</h3>
      <p>We are looking for a Senior Frontend Engineer to lead our web team. You will be responsible for architecture, performance, and best practices.</p>
      <h4>Requirements</h4>
      <ul>
        <li>5+ years of React experience</li>
        <li>Strong TypeScript skills</li>
        <li>Experience with Next.js or Vite</li>
      </ul>`,
      source: 'LinkedIn',
      isApplied: false,
    };
    // return fetchWithAuth(`/jobs/${id}`);
  },

  tailorJob: async (id: string): Promise<TailoredDocs> => {
    return new Promise((resolve) => setTimeout(() => resolve({
      originalResume: "Results-driven Software Engineer with 5 years experience in React...",
      tailoredResume: "Results-driven Frontend Engineer focusing on Next.js and architectural leadership. 5+ years building performing React applications...",
      coverLetter: "Dear Hiring Manager,\n\nI am thrilled to apply for the Senior Frontend Engineer position at Acme Corp. With over 5 years of experience building performant web applications using React and TypeScript, I am confident in my ability to significantly contribute to your engineering team...",
      questionsAndAnswers: [
        { question: "How many years of React experience do you have?", answer: "I have 5 years of professional experience with React." },
        { question: "Are you comfortable with a remote environment?", answer: "Yes, I have worked remotely for the last 3 years." }
      ]
    }), 2000));
    // return fetchWithAuth(`/jobs/${id}/tailor`, { method: 'POST' });
  },

  approveApplication: async (id: string, docs: Partial<TailoredDocs>): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
    // return fetchWithAuth(`/jobs/${id}/approve`, { method: 'POST', body: JSON.stringify(docs) });
  },

  skipApplication: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 500));
    // return fetchWithAuth(`/jobs/${id}/skip`, { method: 'POST' });
  },

  getApplications: async (): Promise<Application[]> => {
    return [
      {
        id: 'a1',
        jobId: 'j1',
        jobTitle: 'Frontend Engineer',
        companyName: 'Stripe',
        status: 'Submitted',
        daysSinceSubmitted: 2,
        lastActionDate: new Date().toISOString(),
        timeline: [{ status: 'Submitted', date: new Date().toISOString() }],
      },
      {
        id: 'a2',
        jobId: 'j4',
        jobTitle: 'Senior React Developer',
        companyName: 'Vercel',
        status: 'Interview',
        daysSinceSubmitted: 14,
        lastActionDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        timeline: [
          { status: 'Submitted', date: new Date(Date.now() - 86400000 * 14).toISOString() },
          { status: 'Reviewing', date: new Date(Date.now() - 86400000 * 10).toISOString() },
          { status: 'Interview', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        ],
      }
    ];
    // return fetchWithAuth('/applications');
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    return {
      totalApplied: 142,
      responseRatePercent: 12.5,
      interviews: 4,
      offers: 1,
    };
    // return fetchWithAuth('/dashboard/stats');
  }
};
