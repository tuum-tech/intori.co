import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type UserStatsType } from '@/pages/api/stats/users'

export interface UserStatsParams {
  limit?: number;
  lastId?: string;
}

export interface UserStatsResponse {
  items: UserStatsType[];
  nextCursor?: string;
  hasMore: boolean;
}

const fetchUserStats = async ({ limit = 10, lastId }: UserStatsParams): Promise<UserStatsResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (lastId) params.append('lastId', lastId);

  const response = await axios.get(`/api/stats/users?${params.toString()}`);
  return response.data;
};

export const useUserStats = (initialLimit = 10) => {
  return useInfiniteQuery<UserStatsResponse, Error, UserStatsResponse>({
    queryKey: ['userStats'],
    queryFn: ({ pageParam = undefined }) =>
      fetchUserStats({ limit: initialLimit, lastId: pageParam as string }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: UserStatsResponse) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 
