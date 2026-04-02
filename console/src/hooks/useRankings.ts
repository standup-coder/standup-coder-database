import { useQuery } from '@tanstack/react-query';
import { fetchRankings, fetchRankingById, RankingsData } from '../api/rankings';

export function useRankings() {
  return useQuery<RankingsData, Error>({
    queryKey: ['rankings'],
    queryFn: fetchRankings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRanking(id: string, year?: string) {
  return useQuery({
    queryKey: ['ranking', id, year],
    queryFn: () => fetchRankingById(id, year),
    enabled: !!id,
  });
}
