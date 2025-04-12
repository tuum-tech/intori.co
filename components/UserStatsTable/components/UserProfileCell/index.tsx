import React from 'react'
import Image from 'next/image'
import { useFarcasterUserDetails } from '../../../../requests/farcasterUser'
import styles from './styles.module.css'

type Props = {
  fid: number
}

export const UserProfileCell: React.FC<Props> = ({
  fid
}) => {
  const { data: userDetails, isLoading } = useFarcasterUserDetails(fid)

  if (isLoading) {
    return (
      <td>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingAvatar} />
          <div className={styles.loadingText} />
        </div>
      </td>
    )
  }

  if (!userDetails) {
    return <td>{fid}</td>
  }

  const displayName = userDetails.displayName || userDetails.username

  return (
    <td>
      <a 
        href={`https://warpcast.com/${userDetails.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.profileLink}
      >
        <div className={styles.profileContainer}>
          { userDetails.image && (
            <Image 
              src={userDetails.image} 
              alt={displayName}
              className={styles.avatar}
              width={32}
              height={32}
            />
          )}
          <span className={styles.displayName}>{displayName}</span>
        </div>
      </a>
    </td>
  )
}

