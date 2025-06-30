import axios from 'axios';
import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { type UserStatsType } from "@/pages/api/users"

export interface UserStatsParams {
  limit?: number;
  skip?: number;
  search?: string;
  claimsDisabled?: boolean;
}

export interface UserStatsResponse {
  items: UserStatsType[];
  hasMore: boolean;
}

const fetchUserStats = async ({ limit = 10, skip = 0, search, claimsDisabled }: UserStatsParams): Promise<UserStatsResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (typeof skip === 'number') params.append('skip', skip.toString());
  if (search) params.append('search', search);
  if (claimsDisabled) params.append('claimsDisabled', 'true');

  const response = await axios.get(`/api/users?${params.toString()}`);
  return response.data;
};

export const useUserStats = (initialLimit = 10, search?: string, claimsDisabled?: boolean) => {
  return useInfiniteQuery<UserStatsResponse, Error, UserStatsResponse>({
    queryKey: ['userStats', search, claimsDisabled],
    queryFn: ({ pageParam = 0 }) =>
      fetchUserStats({ limit: initialLimit, skip: pageParam as number, search, claimsDisabled }),
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      // Calculate the next skip value
      return allPages.reduce((acc, page) => acc + (page.items?.length || 0), 0);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useEnableClaims = (search?: string, claimsDisabled?: boolean) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fid: number) => {
      const response = await axios.get(`/api/users/${fid}/enable-claims`);
      return response.data;
    },
    onSuccess: (_, fid) => {
      // Update the specific user's data in the cache with the correct query key
      queryClient.setQueryData(
        ['userStats', search, claimsDisabled],
        (oldData: InfiniteData<UserStatsResponse> | undefined) => {
          if (!oldData?.pages) return oldData;
          
          return {
            ...oldData,
            pages: oldData.pages.map((page: UserStatsResponse) => ({
              ...page,
              items: page.items.map((item: UserStatsType) => 
                item.fid === fid 
                  ? { ...item, claimsDisabled: false }
                  : item
              )
            }))
          };
        }
      );
    },
    onError: (error) => {
      console.error('Failed to enable claims:', error);
    }
  });
}; 
