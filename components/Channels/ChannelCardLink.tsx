import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { ChannelFrameType } from '../../models/channelFrames'
import { FarcasterChannelType } from '../../utils/neynarApi'
import { Skeleton } from '../common/Skeleton'
import { getFarcasterChannelDetails, getChannelMembersTotal } from '../../requests/farcaster'
import { getPotentialMembersTotal } from '../../requests/potentialChannelMembers'
import { shortenNumber, timeAgo } from '../../utils/textHelpers'
import styles from './styles.module.css'

type Props = {
  channelFrame: ChannelFrameType
}

export const ChannelCardLink: React.FC<Props> = ({
  channelFrame
}) => {
  const [channelDetails, setChannelDetails] = useState<FarcasterChannelType>()
  const [potentialMembers, setPotentialMembers] = useState<number>(0)
  const [channelMembers, setChannelMembers] = useState<number>(0)
  const [loadingPotentialMembers, setLoadingPotentialMembers] = useState<boolean>(true)

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const res = await getFarcasterChannelDetails(channelFrame.channelId)
        setChannelDetails(res.data)
      } catch (err) {
        toast.error(`Failed to fetch channel details for ${channelFrame.channelId}. Please try again later.`)
      }
    }

    fetchChannelDetails()
  }, [channelFrame])

  useEffect(() => {
    const fetchPotentialMembers = async () => {
      try {
        const res = await getPotentialMembersTotal({ channelId: channelFrame.channelId })
        setPotentialMembers(res.data.total)
      } catch (err) {
        setPotentialMembers(0)
        toast.error(`Failed to fetch potential members for ${channelFrame.channelId}. Please try again later.`)
      }
      setLoadingPotentialMembers(false)
    }

    fetchPotentialMembers()
  
  }, [channelFrame])

  useEffect(() => {
    const fetchChannelMembers = async () => {
      try {
        const res = await getChannelMembersTotal(channelFrame.channelId)
        setChannelMembers(res.data.total)
      } catch (err) {
        setChannelMembers(0)
        toast.error(`Failed to fetch channel members for ${channelFrame.channelId}. Please try again later.`)
      }
    }

    fetchChannelMembers()
  }, [channelFrame])

  const createdAgo = useMemo(() => {
    if (!channelFrame?.createdAt) {
      return ''
    }

    const createdAtDate = new Date(channelFrame.createdAt)

    return `Joined ${timeAgo(createdAtDate.toISOString())}`
  }, [channelFrame])

  if (!channelDetails) {
    return (
      <a href="#" className={styles.channelCard}>
      <div
        className={styles.imageContainer}
        style={{ background: '#666'}}
      />
        <h4>
          <Skeleton width={220} inline />
        </h4>
        <div className={styles.stats}>
          <span><Skeleton width={50} inline /></span> • <span><Skeleton width={80} inline /></span>
        </div>
        <div className={styles.stats}>
          { createdAgo }
        </div>
        <h3>
          <Skeleton width={100} inline />
        </h3>
      </a>
    )
  }

  return (
    <a href={`/channels/${channelFrame.channelId}`} className={styles.channelCard}>
      <div
        className={styles.imageContainer}
        style={{ backgroundImage: `url(${channelDetails.imageUrl})`}}
      />
      <h4>
        { `/${channelFrame.channelId}` }
      </h4>
      <div className={styles.stats}>
        <span>{shortenNumber(channelMembers)} Member{channelMembers === 1 ? '' : 's'}</span> • <span>{shortenNumber(channelDetails.followCount ?? 0)} Followers</span>
      </div>
      <div className={styles.stats}>
        { createdAgo }
      </div>
      { !loadingPotentialMembers && (
        <h3>
          {potentialMembers} Potential Member{potentialMembers === 1 ? '' : 's'}
        </h3>
      )}
      { loadingPotentialMembers && (
        <h3>
          <Skeleton width={100} inline />
        </h3>
      )}
    </a>
  )
}

export const ChannelCardsContainer: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className={styles.container}>
      { children }
    </div>
  )
}
