import React from 'react'
import { useSponsors } from '@/hooks/useSponsors'
import { UserProfileCell } from '../UserStatsTable/components/UserProfileCell'
import { formatDistanceToNow } from 'date-fns'
import styles from './styles.module.css'

export const SponsorsTable: React.FC = () => {
  const { data: sponsors, isLoading, error } = useSponsors()

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        Loading sponsors...
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        Error loading sponsors: {error.message}
      </div>
    )
  }

  if (!sponsors || sponsors.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        No sponsors found.
      </div>
    )
  }

  return (
    <div>
      <table className={styles.sponsorsTable}>
        <thead>
          <tr>
            <th>User</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.fid}>
              <td>
                <UserProfileCell fid={sponsor.fid} />
              </td>
              <td>
                {formatDistanceToNow(new Date(sponsor.createdAt), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
