import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { FarcasterUserType } from '../utils/neynarApi'

const fetchFarcasterUserDetails = async (fid: number): Promise<FarcasterUserType> => {
  const response = await axios.get(`/api/farcaster/user/${fid}`)
  return response.data
}

export const useFarcasterUserDetails = (fid: number) => {
  return useQuery<FarcasterUserType>({
    queryKey: ['farcasterUser', fid],
    queryFn: () => fetchFarcasterUserDetails(fid),
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30 days
    retry: 1,
    enabled: !!fid,
  })
} 
