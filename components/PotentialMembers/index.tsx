import React, { useCallback, useMemo, useEffect, useState } from 'react'
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

  const uniquePotentialMemberFids = useMemo((): number[] => {
    const fids = potentialMembers.map((potentialMember) => potentialMember.fid)

    return Array.from(new Set(fids))
  }, [potentialMembers])

  const getPotentialMemberCastsForFid = useCallback((fid: number) => {
    return potentialMembers.filter((potentialMember) => potentialMember.fid === fid)
  }, [potentialMembers])

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

  const sortPotentialMembersBasedOnMostPotentialMemberCasts = useCallback(
    (fidA: number, fidB: number) => {
      const potentialMemberCastsA = getPotentialMemberCastsForFid(fidA)
      const potentialMemberCastsB = getPotentialMemberCastsForFid(fidB)

      return potentialMemberCastsB.length - potentialMemberCastsA.length
    },
    [getPotentialMemberCastsForFid]
  )

  const title = useMemo(() => {
    if (loading) {
      return 'Potential Members'
    }

    return `${uniquePotentialMemberFids.length} Potential Member${uniquePotentialMemberFids.length === 1 ? '' : 's'}`
  }, [loading, uniquePotentialMemberFids])

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
            uniquePotentialMemberFids.sort(sortPotentialMembersBasedOnMostPotentialMemberCasts).map((fid) => (
              <OnePotentialMember
                key={fid}
                fid={fid}
                potentialMemberCasts={getPotentialMemberCastsForFid(fid)}
              />
            ))
          }
        </div>
      </div>
    </Section>
  )
}

