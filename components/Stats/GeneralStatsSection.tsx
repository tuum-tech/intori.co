import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { LoadingStatsCard, StatsCard, StatsContainer } from './StatsCard'

type Props = {
  channelId?: string
}

export const GeneralStatsSection: React.FC<Props> = ({ channelId }) => {
  const [loading, setLoading] = useState(true)
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0)
  const [totalResponses, setTotalResponses] = useState(0)
  const [pendingFriends, setPendingFriends] = useState(0)
  const [acceptedFriends, setAcceptedFriends] = useState(0)

  useEffect(() => {
    const urlParts = [
      `/api/stats/general`
    ]

    fetch(urlParts.join('')).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((data: { uniqueUsersCount: number, totalResponses: number, pendingFriends: number, acceptedFriends: number }) => {
      setUniqueUsersCount(data.uniqueUsersCount)
      setTotalResponses(data.totalResponses)
      setPendingFriends(data.pendingFriends)
      setAcceptedFriends(data.acceptedFriends)
    }).catch((err) => {
      toast.error('Failed to fetch stats. Please try again later.')
      console.error('Error:', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [channelId])

  if (loading) {
    return (
      <StatsContainer>
        <LoadingStatsCard title="Unique Users" />

        <LoadingStatsCard title="Total questions answered" />
      </StatsContainer>
    )
  }

  return (
    <StatsContainer>
      <StatsCard
        title="Unique Users"
        value={uniqueUsersCount.toLocaleString()}
      />

      <StatsCard
        title="Total questions answered"
        value={totalResponses.toLocaleString()}
      />

      <StatsCard
        title="Pending Friend Requests"
        value={pendingFriends.toLocaleString()}
      />

      <StatsCard
        title="Accepted Friend Requests"
        value={acceptedFriends.toLocaleString()}
      />
    </StatsContainer>
  )
}

