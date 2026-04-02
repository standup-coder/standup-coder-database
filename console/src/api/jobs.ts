// 岗位数据 API

export interface Job {
  id: string;
  title: string;
  category: string;
  icon: string;
  locations: string[];
  salaryMin: number;
  salaryMax: number;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  experience: string;
  education: string;
}

export interface JobsData {
  total: number;
  categories: { name: string; count: number }[];
  jobs: Job[];
  filterOptions: {
    categories: string[];
    locations: string[];
    experience: string[];
  };
}

export async function fetchJobs(): Promise<JobsData> {
  const response = await fetch('/data/jobs.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
