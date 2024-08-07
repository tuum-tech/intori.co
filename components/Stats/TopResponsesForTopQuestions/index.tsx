import React, { useState, useEffect } from 'react'
import { Bar } from "react-chartjs-2";
import { toast } from 'react-toastify'
import { StatsContainer, StatsChartContainer, SmallStatsChartContainer } from '../StatsCard'
import { Empty } from '../../common/Empty'

type Props = {
  channelId?: string
}

export const TopResponsesForTopQuestions: React.FC<Props> = ({
  channelId
}) => {
  const [loading, setLoading] = useState(true)
  const [topResponsesForTopQuestions, setTopResponsesForTopQuestions] = useState<Array<{
    question: string
    answers: {
      answer: string
      count: number
    }[]
  }>>([])

  useEffect(() => {
    const urlParts = [
      `/api/stats/charts/responses-for-top-questions`
    ]

    if (channelId) {
      urlParts.push(`?channelId=${channelId}`)
    }

    fetch(urlParts.join('')).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((data) => {
      setTopResponsesForTopQuestions(data.responsesForTopQuestions)
    }).catch((err) => {
      toast.error('Failed to fetch stats. Please try again later.')
      console.error('Error:', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [channelId])

  const getChartData = (question: string) => {
    const questionData = topResponsesForTopQuestions.find((q) => q.question === question)

    if (!questionData) {
      return {
        labels: [],
        datasets: []
      }
    }

    return {
      labels: questionData.answers.map((answer) => answer.answer),
      datasets: [
        {
          label: 'Number of Responses',
          data: questionData.answers.map((answer) => answer.count),
          fill: false,
          backgroundColor: 'rgba(133, 88, 227,1)'
        }
      ]
    }
  }

  if (loading) {
    return (
      <StatsContainer>
        <Empty>Preparing stats...</Empty>
      </StatsContainer>
    )
  }

  if (!topResponsesForTopQuestions.length) {
    return (
      <StatsChartContainer title="Top Responses for Top 10 Questions">
        <Empty>No data available</Empty>
      </StatsChartContainer>
    )
  }

  return (
    <StatsChartContainer title="Top Responses for Top 10 Questions">
      {
        topResponsesForTopQuestions.map((question, index) => (
          <SmallStatsChartContainer key={index} title={question.question}>
            <Bar
              data={getChartData(question.question)}
              title={question.question}
              options={{ responsive: true, indexAxis: 'y' }}
            />
          </SmallStatsChartContainer>
        ))
      }
    </StatsChartContainer>
  )
}

