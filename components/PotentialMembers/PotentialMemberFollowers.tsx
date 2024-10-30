import React, { useEffect, useState } from 'react'
import { PotentialChannelMemberType } from '../../models/potentialChannelMember'
import { getRelevantFollowers } from '../../requests/farcaster'
import { handleError } from '../../utils/handleError'
import { SmallUserCard } from '../common/SmallUserCard'
import { Empty } from '../common/Empty'
import { FarcasterUserType, } from '../../utils/neynarApi'

import styles from './styles.module.css'

type Props = {
  potentialMember: PotentialChannelMemberType
}

export const PotentialMemberFollowers: React.FC<Props> = ({
  potentialMember
}) => {
  const [loading, setLoading] = useState(true)
  const [followers, setFollowers] = useState<{
    top: FarcasterUserType[]
    others: number
  }>({
    top: [],
    others: 0
  })

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await getRelevantFollowers(potentialMember.fid)

        setFollowers(res.data)
      } catch (err) {
        handleError(err, `Something went wrong while fetching important followers for FID ${potentialMember.fid} `)
      }

      setLoading(false)
    }

    fetchFollowers()
  }, [potentialMember])

  if (loading) {
    return (
      <div className={styles.followers}>
      <span>Followed by people you know</span>
        <Empty>
          Finding followers...
        </Empty>
      </div>
    )
  }

  if (followers.top.length === 0) {
    return (
      <div className={styles.followers}>
        <Empty>
          Not followed by anyone you know
        </Empty>
      </div>
    )
  }

  return (
    <div className={styles.followers}>
      <span>Followed by people you know</span>
      {
        followers.top.map((follow) => (
          <div className={styles.follow} key={follow.fid}>
            <SmallUserCard fid={follow.fid} defaultUserDetails={follow} />
          </div>
        ))
      }
      {
        followers.others > 0 && (
          <div className={styles.others}>
            and {followers.others} other{followers.others > 1 ? 's' : ''}...
          </div>
        )
      }
    </div>
  )
}

