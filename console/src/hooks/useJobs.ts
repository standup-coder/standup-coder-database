import { useQuery } from '@tanstack/react-query';
import { fetchJobs, JobsData } from '../api/jobs';

export function useJobs() {
  return useQuery<JobsData, Error>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000,
  });
}
