import React from 'react'
import { type UserStatsType } from '@/pages/api/stats/users'
import { useUserStats } from '../../requests/userStats'
import { InfiniteData } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { UserProfileCell } from './components/UserProfileCell'
import { PrimaryButton } from '@/components/common/Button'

import styles from './styles.module.css'

interface UserStatsPage {
  items: UserStatsType[];
  nextCursor?: string;
  hasMore: boolean;
}

export const UserStatsTable: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useUserStats(50)

  const allItems = React.useMemo(() => {
    const infiniteData = data as InfiniteData<UserStatsPage> | undefined
    if (!infiniteData?.pages) return []
    return infiniteData.pages.flatMap((page: UserStatsPage) => page.items)
  }, [data])

  return (
    <div>
      <table className={styles.userStatsTable}>
        <thead>
          <tr>
            <th>User</th>
            <th>Total Insights</th>
            <th>Friends</th>
            <th>Gifts Sent</th>
            <th>Points</th>
            <th>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {allItems.map((item) => (
            <tr key={item.id}>
              <UserProfileCell fid={item.fid} />
              <td>{item.totalInsights} insights</td>
              <td>{item.totalFriends} friends</td>
              <td>{item.totalGiftsSent} gifts sent</td>
              <td>{item.totalPoints ? BigInt(item.totalPoints).toLocaleString() : 0} points</td>
              <td>{formatDistanceToNow(item.lastUpdated, { addSuffix: true })}</td>
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
