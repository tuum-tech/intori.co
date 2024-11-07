import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { PotentialChannelMemberType } from '../../models/potentialChannelMember'
import {
  getFarcasterUserDetails
} from '../../requests/farcaster'
import { PrimaryButton } from '../common/Button'
import {
  FarcasterUserType
} from '../../utils/neynarApi'
import { OnePotentialMemberCast } from './OnePotentialMemberCast'
import styles from './styles.module.css'
import { Skeleton, SkeletonCircle } from '../common/Skeleton'

type Props = {
  fid: number
  potentialMemberCasts: PotentialChannelMemberType[]
}

export const OnePotentialMember: React.FC<Props> = ({
  fid,
  potentialMemberCasts
}) => {
  const [userDetails, setUserDetails] = useState<FarcasterUserType>()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await getFarcasterUserDetails(fid)
        setUserDetails(res.data)
      } catch (err) {
        toast.error('Something went wrong while fetching user details')
      }
    }

    fetchUserDetails()
  }, [fid])

  if (!userDetails) {
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
      <div className={styles.fid}>FID {fid}</div>

      <a
        href={`https://warpcast.com/${userDetails.username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.imageContainer}>
          <img src={userDetails.image ?? '/assets/templates/avatar_fallback.png'} alt={userDetails.username} width={40} height={40} />
        </div>
        <h4>{userDetails.username}</h4>
      </a>
      { potentialMemberCasts.length } moderator reaction{potentialMemberCasts.length === 1 ? '' : 's'}

      <details className={styles.viewCasts}>
        <summary>
          View Casts
        </summary>
        {
          potentialMemberCasts.map((cast) => (
            <OnePotentialMemberCast
              key={cast.castHash}
              castHash={cast.castHash}
              username={userDetails.username}
            />
          ))
        }
      </details>

      <a
        href={`https://warpcast.com/~/channel/${potentialMemberCasts[0].channelId}/settings/invite`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <PrimaryButton>
          Invite to {`/${potentialMemberCasts[0].channelId}`}
        </PrimaryButton>
      </a>
    </div>
  )
}
