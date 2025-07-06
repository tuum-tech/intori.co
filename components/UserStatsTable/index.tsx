import React, { useState, useEffect } from 'react'
import { type UserStatsType } from '@/pages/api/users'
import { useUserStats, useEnableClaims, useBanUser } from '../../requests/userStats'
import { InfiniteData } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { UserProfileCell } from './components/UserProfileCell'
import { PrimaryButton } from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useDebounce } from '@/hooks/useDebounce'
import { toast } from 'react-toastify'

import styles from './styles.module.css'

interface UserStatsPage {
  items: UserStatsType[];
  nextCursor?: string;
  hasMore: boolean;
}

export const UserStatsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [claimsDisabledFilter, setClaimsDisabledFilter] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useUserStats(50, debouncedSearchTerm, claimsDisabledFilter)
  const enableClaimsMutation = useEnableClaims(debouncedSearchTerm, claimsDisabledFilter)
  const banUserMutation = useBanUser(debouncedSearchTerm, claimsDisabledFilter)

  // Toast effect for enable claims mutation
  useEffect(() => {
    if (enableClaimsMutation.isPending) {
      const toastId = toast.loading('Enabling claims...')
      return () => toast.dismiss(toastId)
    }
  }, [enableClaimsMutation.isPending])

  // Success toast for enable claims mutation
  useEffect(() => {
    if (enableClaimsMutation.isSuccess) {
      toast.success('Claims enabled.')
    }
  }, [enableClaimsMutation.isSuccess])

  // Toast effect for ban user mutation
  useEffect(() => {
    if (banUserMutation.isPending) {
      const toastId = toast.loading('Banning user...')
      return () => toast.dismiss(toastId)
    }
  }, [banUserMutation.isPending])

  // Success toast for ban user mutation
  useEffect(() => {
    if (banUserMutation.isSuccess) {
      toast.success('User banned.')
    }
  }, [banUserMutation.isSuccess])

  const allItems = React.useMemo(() => {
    const infiniteData = data as InfiniteData<UserStatsPage> | undefined
    if (!infiniteData?.pages) return []
    return infiniteData.pages.flatMap((page: UserStatsPage) => page.items)
  }, [data])

  const handleEnableClaims = (fid: number) => {
    enableClaimsMutation.mutate(fid)
  }

  const handleBanUser = (fid: number) => {
    banUserMutation.mutate(fid)
  }

  return (
    <div>
      <div>
        <Input
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
      </div>
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={claimsDisabledFilter}
            onChange={(e) => setClaimsDisabledFilter(e.target.checked)}
          />
          View Claims Disabled Only
        </label>
      </div>
      <table className={styles.userStatsTable}>
        <thead>
          <tr>
            <th>User</th>
            <th>Total Insights</th>
            <th>Friends</th>
            <th>Gifts Sent</th>
            <th>Points</th>
            <th>Last Activity</th>
            <th>Spam Score</th>
            <th>Red Flags</th>
            <th>Status</th>
            <th>Claims Disabled</th>
          </tr>
        </thead>
        <tbody>
          { isLoading && (
            <tr>
              <td colSpan={10} className={styles.loadingRow}>
                Loading...
              </td>
            </tr>
          )}
          {allItems.map((item) => (
            <tr key={item.id}>
              <UserProfileCell fid={item.fid} />
              <td>{item.totalInsights} insights</td>
              <td>{item.totalFriends} friends</td>
              <td>{item.totalGiftsSent} gifts sent</td>
              <td>{item.totalPoints ? BigInt(item.totalPoints).toLocaleString() : 0} points</td>
              <td>{formatDistanceToNow(item.lastUpdated, { addSuffix: true })}</td>
              <td>{item.spamScore.toFixed(2)}</td>
              <td>{item.totalRedFlags} red flag(s)</td>
              <td>
                {item.banned ? (
                  "Banned"
                ) : (
                  <button 
                    type="button" 
                    className={styles.banUserButton}
                    onClick={() => handleBanUser(item.fid)}
                  >
                    Ban User
                  </button>
                )}
              </td>
              <td>{
                item.claimsDisabled
                  ? <button 
                      type="button" 
                      className={styles.enableClaimsButton}
                      onClick={() => handleEnableClaims(item.fid)}
                    >
                      Enable Claims
                    </button>
                  : ""
              }</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.loadMoreContainer}>
        {hasNextPage && (
          <PrimaryButton 
            onClick={() => fetchNextPage()} 
            disabled={isFetching}
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}
