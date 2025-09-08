import axios from 'axios';
import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { IntoriPlusApplication } from '@prisma/client';

export interface IntoriPlusApplicationParams {
  limit?: number;
  skip?: number;
}

export interface IntoriPlusApplicationResponse {
  items: IntoriPlusApplication[];
  hasMore: boolean;
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

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['intoriPlusApplications']);

      // Optimistically update the cache
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

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(['intoriPlusApplications'], context.previousData);
      }
      console.error('Failed to update application status:', error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['intoriPlusApplications'] });
    }
  });
};

