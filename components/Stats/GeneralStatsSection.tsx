import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { StatsCard, StatsContainer } from './StatsCard'

type Props = {
  channelId?: string
}

export const GeneralStatsSection: React.FC<Props> = ({ channelId }) => {
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0)
  const [totalResponses, setTotalResponses] = useState(0)

  useEffect(() => {
    const urlParts = [
      `/api/stats/general`
    ]

    if (channelId) {
      urlParts.push(`?channelId=${channelId}`)
    }

    fetch(urlParts.join('')).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((data) => {
      console.log({ data })
      setUniqueUsersCount(data.uniqueUsersCount)
      setTotalResponses(data.totalResponses)
    }).catch((err) => {
      toast.error('Failed to fetch stats. Please try again later.')
      console.error('Error:', err)
    })
  }, [])

  return (
    <StatsContainer>
      <StatsCard
        title="Unique Users"
        value={uniqueUsersCount}
      />

      <StatsCard
        title="Total questions answered"
        value={totalResponses}
      />
    </StatsContainer>
  )
}

