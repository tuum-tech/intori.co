import React, { useEffect, useState } from 'react'
import { FarcasterCastType } from '../../utils/neynarApi'
import {
  getFarcasterCastDetails
} from '../../requests/farcaster'
import { Skeleton } from '../common/Skeleton'
import styles from './styles.module.css'

type Props = {
  castHash: string
  username: string
}

export const OnePotentialMemberCast: React.FC<Props> = ({
  castHash,
  username
}) => {
  const [castDetails, setCastDetails] = useState<FarcasterCastType>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const fetchCastDetails = async () => {
      try {
        const res = await getFarcasterCastDetails(castHash)
        setCastDetails(res.data)
      } catch (err) {
        setFailed(true)
      }
    }

    fetchCastDetails()
  }, [castHash])

  if (failed) {
    return (
      <div className={styles.cast}>
        <p>Failed to load this cast. This cast may have been deleted.</p>
        <div className={styles.castStats}>
          <a
            href={`https://warpcast.com/${username}/${castHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Cast
          </a>
        </div>
      </div>
    )
  }

  if (!castDetails) {
    return (
      <div className={styles.cast}>
        <Skeleton width={150} />
      </div>
    )
  }

  return (
    <div className={styles.cast}>
      <p>&quot;{ castDetails.text }&quot;</p>
      <div className={styles.castStats}>
        <div> {castDetails.reactions.likes_count} Like{castDetails.reactions.likes_count === 1 ? '' : 's'} </div>
        •
        <div> {castDetails.replies.count} Repl{castDetails.replies.count === 1 ? 'y' : 'ies'} </div>
        •
        <a
          href={`https://warpcast.com/${username}/${castDetails.hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Cast
        </a>
      </div>
    </div>
  )
}

