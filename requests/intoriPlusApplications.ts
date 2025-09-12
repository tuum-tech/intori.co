import axios from 'axios';
import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData, useQuery } from '@tanstack/react-query';
import { IntoriPlusApplication } from '@prisma/client';

export interface IntoriPlusApplicationParams {
  limit?: number;
  skip?: number;
}

export interface IntoriPlusApplicationResponse {
  items: IntoriPlusApplication[];
  hasMore: boolean;
}

export interface IntoriPlusApplicationStats {
  totalApplicants: number;
  approved: number;
  pending: number;
}

const fetchIntoriPlusApplications = async ({ limit = 10, skip = 0 }: IntoriPlusApplicationParams): Promise<IntoriPlusApplicationResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (typeof skip === 'number') params.append('skip', skip.toString());

  const response = await axios.get(`/api/intori-plus-applications?${params.toString()}`);
  return response.data;
};

export const useIntoriPlusApplications = (initialLimit = 10) => {
  return useInfiniteQuery<IntoriPlusApplicationResponse, Error, IntoriPlusApplicationResponse>({
    queryKey: ['intoriPlusApplications'],
    queryFn: ({ pageParam = 0 }) =>
      fetchIntoriPlusApplications({ limit: initialLimit, skip: pageParam as number }),
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      // Calculate the next skip value
      return allPages.reduce((acc, page) => acc + (page.items?.length || 0), 0);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'APPROVED' | 'REJECTED' }) => {
      const response = await axios.put(`/api/intori-plus-applications/${id}/status`, { status });
      return response.data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['intoriPlusApplications'] });
      await queryClient.cancelQueries({ queryKey: ['intoriPlusApplicationStats'] });

      // Snapshot the previous values
      const previousApplicationsData = queryClient.getQueryData(['intoriPlusApplications']);
      const previousStatsData = queryClient.getQueryData(['intoriPlusApplicationStats']);

      // Optimistically update the applications cache
      queryClient.setQueryData(['intoriPlusApplications'], (oldData: InfiniteData<IntoriPlusApplicationResponse> | undefined) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: IntoriPlusApplicationResponse) => ({
            ...page,
            items: page.items.map((item: IntoriPlusApplication) => 
              item.id === id 
                ? { ...item, status }
                : item
            )
          }))
        };
      });

      // Optimistically update the stats cache
      queryClient.setQueryData(['intoriPlusApplicationStats'], (oldStats: IntoriPlusApplicationStats | undefined) => {
        if (!oldStats) return oldStats;
        
        const newStats = { ...oldStats };
        
        if (status === 'APPROVED') {
          newStats.approved += 1;
          newStats.pending -= 1;
        } else if (status === 'REJECTED') {
          newStats.pending -= 1;
        }
        
        return newStats;
      });

      // Return a context object with the snapshotted values
      return { previousApplicationsData, previousStatsData };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousApplicationsData) {
        queryClient.setQueryData(['intoriPlusApplications'], context.previousApplicationsData);
      }
      if (context?.previousStatsData) {
        queryClient.setQueryData(['intoriPlusApplicationStats'], context.previousStatsData);
      }
      console.error('Failed to update application status:', error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['intoriPlusApplications'] });
      queryClient.invalidateQueries({ queryKey: ['intoriPlusApplicationStats'] });
    }
  });
};

export const useIntoriPlusApplicationStats = () => {
  return useQuery<IntoriPlusApplicationStats, Error>({
    queryKey: ['intoriPlusApplicationStats'],
    queryFn: async () => {
      const response = await axios.get('/api/intori-plus-applications/stats');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

