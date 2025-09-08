import React from 'react'
import { toast } from "react-toastify"
import { IntoriPlusApplication } from '@prisma/client';
import { useIntoriPlusApplications, useUpdateApplicationStatus } from '../../requests/intoriPlusApplications'
import { InfiniteData } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { UserProfileCell } from '../UserStatsTable/components/UserProfileCell'
import { PrimaryButton } from '@/components/common/Button'
import { handleError } from "@/utils/handleError"

import styles from './styles.module.css'

interface IntoriPlusApplicationPage {
  items: IntoriPlusApplication[];
  nextCursor?: string;
  hasMore: boolean;
}

export const IntoriPlusApplicationsTable: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useIntoriPlusApplications(50)
  const updateStatusMutation = useUpdateApplicationStatus()

  const allItems = React.useMemo(() => {
    const infiniteData = data as InfiniteData<IntoriPlusApplicationPage> | undefined
    if (!infiniteData?.pages) return []
    return infiniteData.pages.flatMap((page: IntoriPlusApplicationPage) => page.items)
  }, [data])

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateStatusMutation.mutateAsync({ id, status })
      toast.success(`Application ${status.toLowerCase()}`)
    } catch (err) {
      handleError(err, "Failed to update application status. Please try again later.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className={styles.pendingBadge}>Pending</span>
      case 'APPROVED':
        return <span className={styles.approvedBadge}>Approved</span>
      case 'REJECTED':
        return <span className={styles.rejectedBadge}>Rejected</span>
      default:
        return <span className={styles.unknownBadge}>Unknown</span>
    }
  }

  return (
    <div>
      <p>
        These users had a balance of at least 5,000,000 $INTO at time of application submission.
      </p>
      <table className={styles.applicationsTable}>
        <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4} className={styles.loadingRow}>
                Loading...
              </td>
            </tr>
          )}
          {allItems.map((item) => (
            <tr key={item.id}>
              <UserProfileCell fid={item.fid} />
              <td>{getStatusBadge(item.status)}</td>
              <td>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</td>
              <td>
                {item.status === 'PENDING' && (
                  <div className={styles.actionButtons}>
                    <button 
                      type="button" 
                      className={styles.approveButton}
                      onClick={() => handleStatusUpdate(item.id, 'APPROVED')}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? 'Updating...' : 'Approve'}
                    </button>
                    <button 
                      type="button" 
                      className={styles.rejectButton}
                      onClick={() => handleStatusUpdate(item.id, 'REJECTED')}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? 'Updating...' : 'Reject'}
                    </button>
                  </div>
                )}
              </td>
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
