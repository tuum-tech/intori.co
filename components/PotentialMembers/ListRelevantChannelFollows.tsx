import React, { useMemo, useEffect, useState } from 'react'
import {
  getPotentialChannelMemberRelevantFollows
} from '../../requests/potentialChannelMemberRelevantFollows'
import { SmallUserCard } from '../common/SmallUserCard'
import { PotentialChannelMemberRelevantFollow } from '../../models/potentialChannelMemberRelevantFollows'
import styles from './styles.module.css'

type Props = {
  fid: number
  channelId: string
}

export const ListRelevantChannelFollows: React.FC<Props> = ({
  fid,
  channelId
}) => {
  const [loading, setLoading] = useState(true)
  const [relevantFollows, setRelevantFollows] = useState<PotentialChannelMemberRelevantFollow[]>([])
  
  useEffect(() => {
    const fetchRelevantFollows = async () => {
      try {
        const res = await getPotentialChannelMemberRelevantFollows({
          channelId,
          potentialMemberFid: fid
        })

        setRelevantFollows(res.data)
      } catch (err) {
        setRelevantFollows([])
        console.error('Something went wrong while fetching relevant follows', err)
      }

      setLoading(false)
    }

    fetchRelevantFollows()
  }, [fid, channelId])

  const moderatorFollows = useMemo(() => {
    return relevantFollows.filter(follow => follow.followedByRole === 'moderator')
  }, [relevantFollows])

  const memberFollows = useMemo(() => {
    return relevantFollows.filter(follow => follow.followedByRole === 'member')
  }, [relevantFollows])

  if (loading) {
    return (
      <div className={styles.relevantChannelFollows}>
        Checking if any members follow this user...
      </div>
    )
  }

  return (
    <div className={styles.relevantChannelFollows}>
      {relevantFollows.length === 0 && (
        <p>No channel members or moderators follow this user.</p>
      )}
      {relevantFollows.length > 0 && (
        <>
          <p>
            Followed by {moderatorFollows.length} channel moderator{moderatorFollows.length === 1 ? '' : 's'}, {memberFollows.length} channel member{memberFollows.length === 1 ? '' : 's'}
          </p>
          <details>
            <summary>View members that follow this user</summary>
            {
              relevantFollows.map((follow) => (
                <SmallUserCard
                  key={follow.followedByFid}
                  fid={follow.followedByFid}
                />
              ))
            }
          </details>
        </>
      )}
    </div>
  )
}

