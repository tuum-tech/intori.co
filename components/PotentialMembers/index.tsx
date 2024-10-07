import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getPotentialMembers } from '../../requests/potentialChannelMembers'
import { getFarcasterUserDetails } from '../../requests/farcaster'
import { FarcasterUserType } from '../../utils/neynarApi'
import { PrimaryButton } from '../common/Button'
import styles from './styles.module.css'

type Props = {
  channelId: string
}

export const ListPotentialMembers: React.FC<Props> = ({
  channelId
}) => {
  const [potentialMembers, setPotentialMembers] = useState<FarcasterUserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPotentialMembers = async () => {
      try {
        const res = await getPotentialMembers({ channelId })
        const uniqueFids = Array.from(new Set(res.data.map(item => item.fid)))

        const users: FarcasterUserType[] = []
        await Promise.all(
           uniqueFids.map(async (fid) => {
             const userDetails = await getFarcasterUserDetails(fid)
              users.push(userDetails.data)
           })
        )

        setPotentialMembers(users)
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
            potentialMembers.map((member) => (
              <div key={member.fid} className={styles.onePotentialMember}>
                <img src={member.image} alt={member.displayName} width={60} height={60} />
                <sub>{member.fid}</sub>
                <h4>{member.displayName}</h4>
                <a href={`https://warpcast.com/${member.username}`}>
                  <PrimaryButton>
                    View Profile
                  </PrimaryButton>
                </a>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
  }

