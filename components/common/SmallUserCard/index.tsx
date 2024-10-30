import React, { useState, useEffect } from 'react'
import { handleError } from '../../../utils/handleError'
import { getFarcasterUserDetails } from '../../../requests/farcaster'
import { Skeleton, SkeletonCircle } from '../Skeleton'
import {
  FarcasterUserType,
} from '../../../utils/neynarApi'
import styles from './styles.module.css'

type Props = {
  fid: number
  defaultUserDetails?: FarcasterUserType
}

export const SmallUserCard: React.FC<Props> = ({ fid, defaultUserDetails }) => {
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<FarcasterUserType>(defaultUserDetails)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await getFarcasterUserDetails(fid)
        setUserDetails(res.data)
      } catch (err) {
        handleError(err, 'Something went wrong while fetching user details. Please try again later.')
      }

      setLoading(false)
    }

    if (!defaultUserDetails) {
      fetchUserDetails()
    } else {
      setLoading(false)
    }
  }, [fid, defaultUserDetails])

  if (loading) {
    return (
      <a href="#" className={styles.smallUserCard} >
        <sub>FID {fid}</sub>
        <div className={styles.userDetails}>
          <SkeletonCircle width={40} />
          <h4>
            <Skeleton width={130} />
          </h4>
        </div>
      </a>
    )
  }

  if (!userDetails) {
    return null
  }

  return (
    <a
      href={`https://warpcast.com/${userDetails.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.smallUserCard}
    >
      <sub>FID {fid}</sub>
      <div className={styles.userDetails}>
        <div
          className={styles.userImage}
          aria-label={userDetails.username}
          style={{ backgroundImage: `url(${userDetails.image ?? '/assets/templates/avatar_fallback.png'})`}}
        />
        <h4>{userDetails.username}</h4>
      </div>
    </a>
  )
}

