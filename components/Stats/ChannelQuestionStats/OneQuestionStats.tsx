import React, { useMemo } from 'react'
import { Bar } from "react-chartjs-2";
import Image from 'next/image'
import { UniquelyCastedQuestionStats } from '../../../requests/channelFrames'
import { SmallUserCard } from '../../common/SmallUserCard'
import { Empty } from '../../common/Empty'
import { Skeleton } from '../../common/Skeleton'
import styles from './styles.module.css'

type Props = {
  stats: UniquelyCastedQuestionStats
  channelId: string
}

export const OneQuestionStats: React.FC<Props> = ({
  stats,
  channelId
}) => {

  const frameImageUrl = useMemo(() => {
    const { questionId } = stats

    if (typeof window === 'undefined') {
      return `${process.env.NEXTAUTH_URL}/api/frames/channels/${channelId}/images/question?qid=${questionId}`
    }

    return `${window.location.origin}/api/frames/channels/${channelId}/images/question?qid=${questionId}`
  }, [channelId, stats])

  const chartData = useMemo(() => {
    return {
      labels: stats.responseTotals.map((answer) => answer.answer),
      datasets: [
        {
          label: 'Number of Responses',
          data: stats.responseTotals.map((answer) => answer.count),
          fill: false,
          backgroundColor: 'rgba(133, 88, 227,1)'
        }
      ]
    }
  }, [stats])

  return (
    <div className={styles.questionStats}>
      <div className={styles.frameImageColumn}>
        <Image
          src={frameImageUrl}
          alt={stats.question}
          width={200}
          height={200}
        />
      </div>

      <div className={styles.statsColumn}>
        <h2>{stats.question}</h2>
        <p className={styles.statsText}>{stats.totalResponses} Total Responses</p>

        <h3>Members ({stats.memberFids.length})</h3>
        <div className={styles.listUsers}>
          {
            stats.memberFids.length === 0 && (
              <Empty>
                No members have responded to this question yet
              </Empty>
            )
          }
          {
            stats.memberFids.map((fid) => (
              <SmallUserCard key={fid} fid={fid} />
            ))
          }
        </div>

        <h3>Nonmembers ({stats.nonMemberFids.length})</h3>
        <div className={styles.listUsers}>
          {
            stats.nonMemberFids.length === 0 && (
              <Empty>
                No nonmembers have responded to this question yet
              </Empty>
            )
          }
          {
            stats.nonMemberFids.map((fid) => (
              <SmallUserCard key={fid} fid={fid} />
            ))
          }
        </div>

        <div className={styles.chartContainer}>
            <Bar
              data={chartData}
              title="Response Totals"
              options={{ responsive: true, indexAxis: 'y' }}
            />
        </div>
      </div>
    </div>
  )
}


export const OneQuestionStatsSkeleton: React.FC = () => {
  return (
    <div className={styles.questionStats}>
      <div className={styles.frameImageColumn}>
        <Skeleton inline={false} width={200} height={200} />
      </div>

      <div className={styles.statsColumn}>
        <h2><Skeleton width={200} /></h2>
        <p className={styles.statsText}><Skeleton width={55} /></p>

        <h3>Members</h3>
        <div className={styles.listUsers} />

        <h3>Nonmembers</h3>
        <div className={styles.listUsers} />

        <div className={styles.chartContainer} />
      </div>
    </div>
  )
}
