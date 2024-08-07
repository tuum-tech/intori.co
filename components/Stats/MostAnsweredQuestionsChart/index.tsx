import React, { useMemo, useState, useEffect } from 'react'
import { Bar } from "react-chartjs-2";
import { toast } from 'react-toastify'
import { StatsContainer, StatsChartContainer } from '../StatsCard'
import { Empty } from '../../common/Empty'

type Props = {
  channelId?: string
}

export const MostAnsweredQuestionsChart: React.FC<Props> = ({
  channelId
}) => {
  const [loading, setLoading] = useState(true)
  const [mostAnsweredQuestions, setMostAnsweredQuestions] = useState<Array<{
    question: string
    answers: number
  }>>([])

  const chartData = useMemo(() => {
    return {
      labels: mostAnsweredQuestions.map((data) => data.question),
      datasets: [
        {
          label: 'Number of Responses',
          data: mostAnsweredQuestions.map((data) => data.answers),
          fill: false,
          backgroundColor: 'rgba(133, 88, 227,1)'
        }
      ]
    }
  }, [mostAnsweredQuestions])

  useEffect(() => {
    const urlParts = [
      `/api/stats/charts/most-answered-questions`
    ]

    if (channelId) {
      urlParts.push(`?channelId=${channelId}`)
    }

    fetch(urlParts.join('')).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((data) => {
      setMostAnsweredQuestions(data.mostAnsweredQuestions)
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

  if (!mostAnsweredQuestions.length) {
    return (
      <StatsChartContainer title="Top 10 Questions">
        <Empty>No data available</Empty>
      </StatsChartContainer>
    )
  }

  return (
    <StatsChartContainer title="Top 10 Questions">
      <Bar data={chartData} options={{
        responsive: true,
        indexAxis: 'y'
      }} />
    </StatsChartContainer>
  )
}

