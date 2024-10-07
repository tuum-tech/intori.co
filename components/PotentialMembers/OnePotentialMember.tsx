import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { PotentialChannelMemberType } from '../../models/potentialChannelMember'
import {
  getFarcasterUserDetails,
  getFarcasterCastDetails
} from '../../requests/farcaster'
import { PrimaryButton } from '../common/Button'
import {
  FarcasterUserType,
  FarcasterCastType
} from '../../utils/neynarApi'
import styles from './styles.module.css'
import { Skeleton, SkeletonCircle } from '../common/Skeleton'

type Props = {
  potentialMember: PotentialChannelMemberType
}

export const OnePotentialMember: React.FC<Props> = ({
  potentialMember
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [userDetails, setUserDetails] = useState<FarcasterUserType>()
  const [castDetails, setCastDetails] = useState<FarcasterCastType>()

  if (loading || !userDetails || !castDetails) {
    return (
      <div className={styles.onePotentialMember}>
        <sub><Skeleton width={40} /></sub>
        <div className={styles.imageContainer}>
          <SkeletonCircle width={60} />
        </div>
        <h4><Skeleton width={200} /></h4>
        <a href="#">
          <PrimaryButton>
            View Profile
          </PrimaryButton>
        </a>
        <div className={styles.cast}>
          <Skeleton width={150} />
        </div>
        <div className={styles.castStats}>
          <div>
            <span><Skeleton width={25} /> </span>
            <sub>Likes</sub>
          </div>
          <div>
            <span><Skeleton width={25} /> </span>
            <sub>Replies</sub>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.onePotentialMember}>
      <sub>{userDetails.fid}</sub>
      <div className={styles.imageContainer}>
        <img src={userDetails.image} alt={userDetails.username} width={60} height={60} />
      </div>
      <h4>{userDetails.username}</h4>
      <a href={`https://warpcast.com/${userDetails.username}`}>
        <PrimaryButton>
          View Profile
        </PrimaryButton>
      </a>
      <div className={styles.cast}>
        &quot;{ castDetails.text }&quot;
      </div>
      <div className={styles.castStats}>
        <div>
          <span>{castDetails.reactions.likes_count}</span>
          <sub>Likes</sub>
        </div>
        <div>
          <span>{castDetails.replies.count}</span>
          <sub>Replies</sub>
        </div>
      </div>
    </div>
  )
}
