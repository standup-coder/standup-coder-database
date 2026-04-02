// 榜单数据 API

import { Ranking } from '../types/ranking';

const BASE_URL = '/data';

export interface RankingsData {
  years: string[];
  categories: { key: string; name: string }[];
  rankings: Ranking[];
  byYear: Record<string, Ranking[]>;
}

export async function fetchRankings(): Promise<RankingsData> {
  const response = await fetch(`${BASE_URL}/rankings.json`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchRankingById(id: string, year?: string): Promise<Ranking | null> {
  const data = await fetchRankings();
  const ranking = data.rankings.find(r => r.id === id && (!year || r.year.toString() === year));
  return ranking || null;
}
