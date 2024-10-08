import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getPotentialMembers } from '../../requests/potentialChannelMembers'
import { PotentialChannelMemberType } from '../../models/potentialChannelMember'
import { OnePotentialMember } from './OnePotentialMember'
import { Empty } from '../common/Empty'
import styles from './styles.module.css'

type Props = {
  channelId: string
}

export const ListPotentialMembers: React.FC<Props> = ({
  channelId
}) => {
  const [potentialMembers, setPotentialMembers] = useState<PotentialChannelMemberType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPotentialMembers = async () => {
      try {
        const res = await getPotentialMembers({ channelId })
        setPotentialMembers(res.data)
      } catch (err) {
        toast.error('Something went wrong loading this channel\'s potential members')
      }
      setLoading(false)
    }

    fetchPotentialMembers()
  }, [channelId])

  return (
    <div className={styles.container}>
      <h3>
        Potential Channel Members
      </h3>
      <div className={styles.listContainer}>
        <div>
          {
            loading && <p>Loading...</p>
          }
          {
            !loading && potentialMembers.length === 0 && (
              <Empty>
                No potential channel members members yet!
              </Empty>
            )
          }
          {
            potentialMembers.map((potentialMember) => (
              <OnePotentialMember
                key={potentialMember.fid}
                potentialMember={potentialMember}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
  }

