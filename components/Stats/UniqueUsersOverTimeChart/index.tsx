import React, { useMemo } from 'react'
import { Line } from "react-chartjs-2";
import { StatsContainer, StatsChartContainer } from '../StatsCard'
import { Empty } from '../../common/Empty'
import { useQuery } from '@tanstack/react-query'

type Props = {
  channelId?: string
}

export const UniqueUsersOverTimeChart: React.FC<Props> = ({
  channelId
}) => {
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['unique-users', channelId],
    queryFn: async () => {
      const urlParts = [`/api/stats/charts/unique-users`]
      if (channelId) {
        urlParts.push(`?channelId=${channelId}`)
      }
      const res = await fetch(urlParts.join(''))
      if (!res.ok) throw new Error('Failed to fetch unique users')

      return res.json() as Promise<{ uniqueUsers: number, date: string }[]>
    },
    staleTime: 1000 * 60 * 30 // 30 minutes
  })

  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions-over-time', channelId],
    queryFn: async () => {
      const urlParts = [`/api/stats/charts/questions-over-time`]
      if (channelId) {
        urlParts.push(`?channelId=${channelId}`)
      }
      const res = await fetch(urlParts.join(''))

      if (!res.ok) throw new Error('Failed to fetch questions data')

      return res.json() as Promise<{ questionsAnswered: number, date: string }[]>
    },
    staleTime: 1000 * 60 * 30 // 30 minutes
  })

  const { data: giftsData, isLoading: isLoadingGifts } = useQuery({
    queryKey: ['gifts-over-time', channelId],
    queryFn: async () => {
      const urlParts = [`/api/stats/charts/gifts-over-time`]
      if (channelId) {
        urlParts.push(`?channelId=${channelId}`)
      }
      const res = await fetch(urlParts.join(''))
      if (!res.ok) throw new Error('Failed to fetch gifts data')

      return res.json() as Promise<{ giftsSent: number, date: string }[]>
    },
    staleTime: 1000 * 60 * 30 // 30 minutes
  })

  const { data: friendRequestsData, isLoading: isLoadingFriendRequests } = useQuery({
    queryKey: ['friend-requests-over-time', channelId],
    queryFn: async () => {
      const res = await fetch(`/api/stats/charts/friend-requests-over-time`)
      if (!res.ok) throw new Error('Failed to fetch friend requests data')

      return res.json() as Promise<{ friendRequests: number, date: string }[]>
    },
    staleTime: 1000 * 60 * 30 // 30 minutes
  })

  const { data: insightLikesData, isLoading: isLoadingInsightLikes } = useQuery({
    queryKey: ['insight-likes-over-time', channelId],
    queryFn: async () => {
      const res = await fetch(`/api/stats/charts/insight-likes-over-time`)
      if (!res.ok) throw new Error('Failed to fetch insight likes data')

      return res.json() as Promise<{ insightLikes: number, date: string }[]>
    },
    staleTime: 1000 * 60 * 30 // 30 minutes
  })

  const chartData = useMemo(() => {
    if (!usersData || !questionsData || !giftsData || !friendRequestsData || !insightLikesData) {
      return {}
    }

    return {
      labels: Array.from(new Set([
        ...usersData.map((data) => data.date), 
        ...questionsData.map((data) => data.date),
        ...giftsData.map((data) => data.date),
        ...friendRequestsData.map((data) => data.date),
        ...insightLikesData.map((data) => data.date)
      ])),
      datasets: [
        {
          label: 'Unique Users',
          data: usersData.map((data) => data.uniqueUsers),
          fill: false,
          backgroundColor: 'rgba(133, 88, 227, 0.2)',
          borderColor: 'rgba(133, 88, 227, 1)',
          yAxisID: 'y-users',
        },
        {
          label: 'Questions Answered',
          data: questionsData.map((data) => data.questionsAnswered),
          fill: false,
          backgroundColor: 'rgba(51, 153, 255, 0.2)',
          borderColor: 'rgba(51, 153, 255, 1)',
          yAxisID: 'y-insights'
        },
        {
          label: 'Gifts Sent',
          data: giftsData.map((data) => data.giftsSent),
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          yAxisID: 'y-insights'
        },
        {
          label: 'Friend Requests',
          data: friendRequestsData.map((data) => data.friendRequests),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          yAxisID: 'y-insights'
        },
        {
          label: 'Insight Likes',
          data: insightLikesData.map((data) => data.insightLikes),
          fill: false,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          yAxisID: 'y-users'
        }
      ]
    }
  }, [usersData, questionsData, giftsData, friendRequestsData, insightLikesData])

  const lineOptions = useMemo(() => {
    return {
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
        axis: 'y',
        includeInvisible: false
      },
      scales: {
        'y-users': {
          type: 'linear' as const,
          position: 'left',
          title: {
            display: true,
            text: 'Users & Likes',
          },
        },
        'y-insights': {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Insights, Gifts, Friend Requests',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
      }
    }
  }, [])

  const isLoading = isLoadingUsers || isLoadingQuestions || isLoadingGifts || isLoadingFriendRequests || isLoadingInsightLikes

  if (isLoading) {
    return (
      <StatsContainer>
        <Empty>Preparing stats...</Empty>
      </StatsContainer>
    )
  }

  if (!chartData) {
    return (
      <StatsChartContainer title="Unique users over past 30 days">
        <Empty>No data available</Empty>
      </StatsChartContainer>
    )
  }

  return (
    <StatsChartContainer title="Unique users over past 30 days">
      { /* @ts-expect-error because line options types are very very strict but this works */ }
      <Line data={chartData} options={lineOptions} />
    </StatsChartContainer>
  )
}