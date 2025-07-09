import React, { useMemo } from 'react'
import { Line } from "react-chartjs-2";
import { StatsContainer, StatsChartContainer } from '../StatsCard'
import { Empty } from '../../common/Empty'
import { useQuery } from '@tanstack/react-query'
import type { DailyStats } from '@prisma/client'
import type { TooltipItem } from 'chart.js';

export const StatsChart: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/charts')
      if (!res.ok) throw new Error('Failed to fetch daily stats')
      return res.json() as Promise<DailyStats[]>
    },
    staleTime: 1000 * 60 * 30 // 30 minutes
  })

  const statsByDate = useMemo(() => {
    if (!data) return {} as Record<string, DailyStats>
    const map: Record<string, DailyStats> = {}
    data.forEach((stat: DailyStats) => {
      const date = new Date(stat.createdAt).toISOString().split('T')[0]
      map[date] = stat
    })
    return map
  }, [data])

  // Only show labels for dates that have a DailyStats object
  const availableDates = useMemo(() => {
    if (!data) return [] as string[]
    return data
      .map(stat => new Date(stat.createdAt).toISOString().split('T')[0])
      .sort()
  }, [data])

  const createDataset = (
    field: keyof DailyStats,
    label: string,
    borderColor: string,
    backgroundColor: string,
    yAxisID: string
  ) => {
    return {
      label,
      data: availableDates.map(date => statsByDate[date]?.[field] ?? 0),
      fill: false,
      backgroundColor,
      borderColor,
      yAxisID
    }
  }

  // Chart for User Activity and Status
  const userActivityData = useMemo(() => {
    if (!data) return {}
    return {
      labels: availableDates,
      datasets: [
        createDataset('uniqueUsers', 'Users that have insights', 'rgba(133, 88, 227, 1)', 'rgba(133, 88, 227, 0.2)', 'y'),
        createDataset('activeUsersAllowedIn', 'Active Users Allowed In', 'rgba(76, 175, 80, 1)', 'rgba(76, 175, 80, 0.2)', 'y'),
        createDataset('bannedUsers', 'Banned Users', 'rgba(244, 67, 54, 1)', 'rgba(244, 67, 54, 0.2)', 'y'),
        createDataset('usersBlocked', 'Users Blocked', 'rgba(255, 152, 0, 1)', 'rgba(255, 152, 0, 0.2)', 'y'),
      ]
    }
  }, [data, availableDates])

  // Chart 1: Gifts Sent, Questions Answered (removed Unique Users)
  const usersGiftsQuestionsData = useMemo(() => {
    if (!data) return {}
    return {
      labels: availableDates,
      datasets: [
        createDataset('giftsSent', 'Gifts Sent', 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)', 'y'),
        createDataset('questionsAnswered', 'Questions Answered', 'rgba(51, 153, 255, 1)', 'rgba(51, 153, 255, 0.2)', 'y'),
      ]
    }
  }, [data, availableDates])

  // Chart 2: Insight Likes, Friend Requests
  const likesRequestsData = useMemo(() => {
    if (!data) return {}
    return {
      labels: availableDates,
      datasets: [
        createDataset('insightLikes', 'Insight Likes', 'rgba(255, 159, 64, 1)', 'rgba(255, 159, 64, 0.2)', 'y'),
        createDataset('acceptedFriendRequests', 'Friend Requests', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)', 'y'),
      ]
    }
  }, [data, availableDates])

  // Chart 3: Special Gifts Sent, Day Passes Bought, Insights Boosted
  const specialsDayPassesBoostedData = useMemo(() => {
    if (!data) return {}
    return {
      labels: availableDates,
      datasets: [
        createDataset('specialGiftsSent', 'Special Gifts Sent', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)', 'y'),
        createDataset('dayPassesBought', 'Day Passes Bought', 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)', 'y'),
        createDataset('insightsBoosted', 'Insights Boosted', 'rgba(255, 99, 71, 1)', 'rgba(255, 99, 71, 0.2)', 'y'),
      ]
    }
  }, [data, availableDates])

  // Helper for percent difference tooltip
  function percentDiffLabel(context: TooltipItem<'line'>) {
    const value = context.parsed.y;
    const index = context.dataIndex;
    const dataArr = context.dataset.data as number[];
    let percentDiff = '';
    if (index > 0) {
      const prev = dataArr[index - 1];
      if (prev !== 0) {
        const diff = ((value - prev) / Math.abs(prev)) * 100;
        const sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
        percentDiff = ` (${sign}${Math.abs(diff).toFixed(1)}%)`;
      } else {
        percentDiff = ' (N/A)';
      }
    }
    return `${context.dataset.label}: ${value.toLocaleString()}${percentDiff}`;
  }

  const userActivityLineOptions = useMemo(() => ({
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false, axis: 'y', includeInvisible: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: percentDiffLabel
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        position: 'left',
        title: { display: true, text: 'Count' },
      },
      x: { title: { display: true, text: 'Date' } },
    }
  }), [])

  // Line options for each chart
  const lineOptionsUsersGiftsQuestions = useMemo(() => ({
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false, axis: 'y', includeInvisible: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: percentDiffLabel
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        position: 'left',
        title: { display: true, text: 'Count' },
      },
      x: { title: { display: true, text: 'Date' } },
    }
  }), [])

  const lineOptionsLikesRequests = useMemo(() => ({
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false, axis: 'y', includeInvisible: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: percentDiffLabel
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Count' },
      },
      x: { title: { display: true, text: 'Date' } },
    }
  }), [])

  const lineOptionsSpecialsDayPassesBoosted = useMemo(() => ({
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false, axis: 'y', includeInvisible: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: percentDiffLabel
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Count' },
      },
      x: { title: { display: true, text: 'Date' } },
    }
  }), [])

  if (isLoading) {
    return (
      <StatsContainer>
        <Empty>Preparing stats...</Empty>
      </StatsContainer>
    )
  }

  if (!userActivityData || !('labels' in userActivityData)) {
    return (
      <StatsChartContainer title="Stats">
        <Empty>No data available</Empty>
      </StatsChartContainer>
    )
  }

  return (
    <>
      <StatsChartContainer title="User Activity and Status">
        {/* @ts-expect-error because line options types are very very strict but this works */}
        <Line data={userActivityData} options={userActivityLineOptions} />
      </StatsChartContainer>
      <StatsChartContainer title="Gifts Sent and Questions Answered">
        {/* @ts-expect-error because line options types are very very strict but this works */}
        <Line data={usersGiftsQuestionsData} options={lineOptionsUsersGiftsQuestions} />
      </StatsChartContainer>
      <StatsChartContainer title="Insight Likes and Friend Requests">
        {/* @ts-expect-error because line options types are very very strict but this works */}
        <Line data={likesRequestsData} options={lineOptionsLikesRequests} />
      </StatsChartContainer>
      <StatsChartContainer title="Special Gifts, Day Passes, and Insights Boosted">
        {/* @ts-expect-error because line options types are very very strict but this works */}
        <Line data={specialsDayPassesBoostedData} options={lineOptionsSpecialsDayPassesBoosted} />
      </StatsChartContainer>
    </>
  )
}
