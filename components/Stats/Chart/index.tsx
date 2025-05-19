import React, { useMemo } from 'react'
import { Line } from "react-chartjs-2";
import { StatsContainer, StatsChartContainer } from '../StatsCard'
import { Empty } from '../../common/Empty'
import { useQuery } from '@tanstack/react-query'
import { CHART_DAYS } from '@/utils/charts'

type Props = {
  channelId?: string
}


export const StatsChart: React.FC<Props> = ({
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

  const shownTimeline = useMemo(() => {
    const labels: string[] = [];
    const today = new Date();

    for (let i = 0; i < CHART_DAYS; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const isoDate = date.toISOString().split('T')[0];
      labels.push(isoDate);
    }

    return labels.reverse()
  }, [])

  const createConsistentDataset = <T extends { date: string }>(
    data: T[] | undefined,
    valueKey: keyof T,
    label: string,
    borderColor: string,
    backgroundColor: string,
    yAxisID: string
  ) => {
    // Create a map of date to value
    const dataMap = new Map(data?.map(item => [item.date, item[valueKey] as number]) || [])

    return {
      label,
      data: shownTimeline.map(date => dataMap.get(date) || 0),
      fill: false,
      backgroundColor,
      borderColor,
      yAxisID
    }
  }

  const chartData = useMemo(() => {
    if (!usersData || !questionsData || !giftsData || !friendRequestsData || !insightLikesData) {
      return {}
    }


    return {
      labels: shownTimeline,
      datasets: [
        createConsistentDataset(usersData, 'uniqueUsers', 'Unique Users', 'rgba(133, 88, 227, 1)', 'rgba(133, 88, 227, 0.2)', 'y-users'),
        createConsistentDataset(questionsData, 'questionsAnswered', 'Questions Answered', 'rgba(51, 153, 255, 1)', 'rgba(51, 153, 255, 0.2)', 'y-insights'),
        createConsistentDataset(giftsData, 'giftsSent', 'Gifts Sent', 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)', 'y-insights'),
        createConsistentDataset(friendRequestsData, 'friendRequests', 'Friend Requests', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)', 'y-insights'),
        createConsistentDataset(insightLikesData, 'insightLikes', 'Insight Likes', 'rgba(255, 159, 64, 1)', 'rgba(255, 159, 64, 0.2)', 'y-insights')
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
      <StatsChartContainer title="Unique users over past 7 days">
        <Empty>No data available</Empty>
      </StatsChartContainer>
    )
  }

  return (
    <StatsChartContainer title="Unique users over past 7 days">
      { /* @ts-expect-error because line options types are very very strict but this works */ }
      <Line data={chartData} options={lineOptions} />
    </StatsChartContainer>
  )
}
