import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type UserStatsType } from '@/pages/api/stats/users'

export interface UserStatsParams {
  limit?: number;
  skip?: number;
}

export interface UserStatsResponse {
  items: UserStatsType[];
  hasMore: boolean;
}

const fetchUserStats = async ({ limit = 10, skip = 0 }: UserStatsParams): Promise<UserStatsResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (typeof skip === 'number') params.append('skip', skip.toString());

  const response = await axios.get(`/api/stats/users?${params.toString()}`);
  return response.data;
};

export const useUserStats = (initialLimit = 10) => {
  return useInfiniteQuery<UserStatsResponse, Error, UserStatsResponse>({
    queryKey: ['userStats'],
    queryFn: ({ pageParam = 0 }) =>
      fetchUserStats({ limit: initialLimit, skip: pageParam as number }),
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      // Calculate the next skip value
      return allPages.reduce((acc, page) => acc + (page.items?.length || 0), 0);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 
