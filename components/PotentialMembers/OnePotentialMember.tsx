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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await getFarcasterUserDetails(potentialMember.fid)
        setUserDetails(res.data)
      } catch (err) {
        toast.error('Something went wrong while fetching user details')
      }
    }

    fetchUserDetails()
  }, [potentialMember.fid])

  useEffect(() => {
    const fetchCastDetails = async () => {
      try {
        const res = await getFarcasterCastDetails(potentialMember.castHash)
        setCastDetails(res.data)
      } catch (err) {
        toast.error('Something went wrong while fetching cast details')
      }
    }

    fetchCastDetails()
  }, [potentialMember.castHash])

  useEffect(() => {
    if (userDetails && castDetails) {
      setLoading(false)
    }
  }, [userDetails, castDetails])

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
          <div><Skeleton width={200} /> </div>
          <div><Skeleton width={230} /> </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.onePotentialMember}>
      <div className={styles.fid}>FID {userDetails.fid}</div>

      <a
        href={`https://warpcast.com/${userDetails.username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.imageContainer}>
          <img src={userDetails.image} alt={userDetails.username} width={40} height={40} />
        </div>
        <h4>{userDetails.username}</h4>
      </a>
      <div className={styles.cast}>
        <p>&quot;{ castDetails.text }&quot;</p>
        <div className={styles.castStats}>
          <div> {castDetails.reactions.likes_count} Like{castDetails.reactions.likes_count === 1 ? '' : 's'} </div>
          •
          <div> {castDetails.replies.count} Replies </div>
          •
          <a
            href={`https://warpcast.com/${userDetails.username}/${castDetails.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Cast
          </a>
        </div>
      </div>
      <div className={styles.actions}>
        <a
          href={`https://warpcast.com/~/channel/${potentialMember.channelId}/settings/invite`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PrimaryButton>
            Invite...
          </PrimaryButton>
        </a>
      </div>
    </div>
  )
}
