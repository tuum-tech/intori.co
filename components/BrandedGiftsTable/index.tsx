import React from 'react'
import { useSession } from 'next-auth/react'
import { useBrandedGifts, useUpdateBrandedGiftStatus } from '@/hooks/useBrandedGifts'
import { formatDistanceToNow } from 'date-fns'
import { UserProfileCell } from '../UserStatsTable/components/UserProfileCell'
import { toast } from 'react-toastify'
import { handleError } from '@/utils/handleError'
import styles from './styles.module.css'

export const BrandedGiftsTable: React.FC = () => {
  const { data: session } = useSession()
  const { data, isLoading, isError } = useBrandedGifts()
  const updateStatusMutation = useUpdateBrandedGiftStatus()
  const isAdmin = session?.admin

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateStatusMutation.mutateAsync({ id, status })
      toast.success(`Sponsored gift ${status.toLowerCase()}`)
    } catch (error) {
      handleError(error, 'Failed to update status. Please try again.')
    }
  }

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading branded gifts...</div>
  }

  if (isError) {
    return <div className={styles.errorContainer}>Error loading branded gifts.</div>
  }

  if (!data?.data || data.data.length === 0) {
    return <div className={styles.emptyContainer}>No branded gifts found.</div>
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
        return <span className={styles.pendingBadge}>Pending</span>
    }
  }

  return (
    <div>
      <table className={styles.brandedGiftsTable}>
        <thead>
          <tr>
            <th>Sponsor</th>
            <th>Target Topic</th>
            <th>Gift URL</th>
            <th>Message</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((item) => (
            <tr key={item.id}>
              <td>
                <UserProfileCell fid={item.brandUserFid} />
              </td>
              <td>{item.targetTopic}</td>
              <td>
                <a 
                  href={item.giftUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.urlLink}
                >
                  {item.giftUrl}
                </a>
              </td>
              <td className={styles.messageCell}>
                {item.message}
              </td>
              <td>{getStatusBadge((item as any).status)}</td>
              <td>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</td>
              <td>
                {isAdmin && (item as any).status === 'PENDING' && (
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
    </div>
  )
}
