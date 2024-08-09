import React, { useMemo, useState, useEffect } from 'react'
import { Line } from "react-chartjs-2";
import { toast } from 'react-toastify'
import { StatsContainer, StatsChartContainer } from '../StatsCard'
import { Empty } from '../../common/Empty'

type Props = {
  channelId?: string
}

export const QuestionsAnsweredOverTimeChart: React.FC<Props> = ({
  channelId
}) => {
  const [loading, setLoading] = useState(true)
  const [questionsAnsweredOverTime, setQuestionsAnsweredOverTime] = useState<Array<{
    date: Date
    questionsAnswered: number
  }>>([])

  const chartData = useMemo(() => {
    return {
      labels: questionsAnsweredOverTime.map((data) => data.date),
      datasets: [
        {
          label: 'Questions Answered',
          data: questionsAnsweredOverTime.map((data) => data.questionsAnswered),
          fill: false,
          backgroundColor: 'rgba(133, 88, 227,0.2)',
          borderColor: 'rgba(133, 88, 227,1)',
        }
      ]
    }
  }, [questionsAnsweredOverTime])

  useEffect(() => {
    const urlParts = [
      `/api/stats/charts/questions-over-time`
    ]

    if (channelId) {
      urlParts.push(`?channelId=${channelId}`)
    }

    fetch(urlParts.join('')).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((data) => {
      setQuestionsAnsweredOverTime(data.questionsAnsweredOverTime)
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
        <Empty>Preparing stats...</Empty>
      </StatsContainer>
    )
  }

  if (!questionsAnsweredOverTime.length) {
    return (
      <StatsChartContainer title="Questions answered over past 30 days">
        <Empty>No data available</Empty>
      </StatsChartContainer>
    )
  }

  return (
    <StatsChartContainer title="Questions answered over past 30 days">
      <Line data={chartData} />
    </StatsChartContainer>
  )
}

