import React, { useMemo, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getPotentialMembers } from '../../requests/potentialChannelMembers'
import { PotentialChannelMemberType } from '../../models/potentialChannelMember'
import { OnePotentialMember } from './OnePotentialMember'
import { Empty } from '../common/Empty'
import { Section } from '../common/Section'
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
        res.data.sort((a, b) => a.fid - b.fid) // sort fids together
        setPotentialMembers(res.data)
      } catch (err) {
        toast.error('Something went wrong loading this channel\'s potential members')
      }
      setLoading(false)
    }

    fetchPotentialMembers()
  }, [channelId])

  const title = useMemo(() => {
    if (loading) {
      return 'Potential Members'
    }

    return `${potentialMembers.length} Potential Member${potentialMembers.length === 1 ? '' : 's'}`
  }, [loading, potentialMembers])

  return (
    <Section title={title}>
      <div className={styles.listContainer}>
        <div>
          {
            loading && <p>Loading...</p>
          }
          {
            !loading && potentialMembers.length === 0 && (
              <Empty>
                No potential channel members yet!
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
    </Section>
  )
}

