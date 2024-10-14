import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ChannelFrameType } from '../../models/channelFrames'
import { FarcasterChannelType } from '../../utils/neynarApi'
import { PotentialChannelMemberType } from '../../models/potentialChannelMember'
import { Skeleton } from '../common/Skeleton'
import { getFarcasterChannelDetails, getChannelMembers } from '../../requests/farcaster'
import { getPotentialMembers } from '../../requests/potentialChannelMembers'
import { shortenNumber } from '../../utils/textHelpers'
import styles from './styles.module.css'

type Props = {
  channelFrame: ChannelFrameType
}

export const ChannelCardLink: React.FC<Props> = ({
  channelFrame
}) => {
  const [channelDetails, setChannelDetails] = useState<FarcasterChannelType>()
  const [potentialMembers, setPotentialMembers] = useState<PotentialChannelMemberType[]>([])
  const [channelMembers, setChannelMembers] = useState<number>(0)

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
        const res = await getPotentialMembers({ channelId: channelFrame.channelId })
        setPotentialMembers(res.data)
      } catch (err) {
        setPotentialMembers([])
        toast.error(`Failed to fetch potential members for ${channelFrame.channelId}. Please try again later.`)
      }
    }

    fetchPotentialMembers()
  
  }, [channelFrame])

  useEffect(() => {
    const fetchChannelMembers = async () => {
      try {
        const res = await getChannelMembers(channelFrame.channelId)
        setChannelMembers(res.data.length)
      } catch (err) {
        setChannelMembers(0)
        toast.error(`Failed to fetch channel members for ${channelFrame.channelId}. Please try again later.`)
      }
    }

    fetchChannelMembers()
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
      <h3>
        {potentialMembers.length} Potential Member{potentialMembers.length === 1 ? '' : 's'}
      </h3>
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
