import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ChannelFrameType } from '../../models/channelFrames'
import { FarcasterChannelType } from '../../utils/neynarApi'
import { Skeleton } from '../common/Skeleton'
import { getFarcasterChannelDetails } from '../../requests/farcaster'
import styles from './styles.module.css'

type Props = {
  channelFrame: ChannelFrameType
}

export const ChannelCardLink: React.FC<Props> = ({
  channelFrame
}) => {
  const [channelDetails, setChannelDetails] = useState<FarcasterChannelType>()

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
        <span>53 Members</span> • <span>{channelDetails.followCount} Followers</span>
      </div>
      <h3>
        5 Potential Members
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
