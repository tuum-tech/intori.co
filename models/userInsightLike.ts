import { createDb } from '../pages/api/utils/firestore'

export type UserInsightLikeType = {
  likedByFid: number
  answerInsightId: string
  createdAt: number // not all likes have this
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  collection = db.collection('userInsightLike')
  return collection
}

export const getInsightLikesOverTime = async (options: {
  startDate: number,
  endDate: number,
}): Promise<Array<{ date: string, insightLikes: number }>> => {
  const { startDate, endDate } = options

  try {
    const collection = getCollection()

    const query = collection
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)

    const snapshot = await query.get()

    if (snapshot.empty) {
      return []
    }

    // Process the data
    const dateRequestMap = new Map()

    snapshot.forEach(doc => {
      const data = doc.data() as UserInsightLikeType
      const date = new Date(data.createdAt).toISOString().split('T')[0] // Group by day

      if (!dateRequestMap.has(date)) {
        dateRequestMap.set(date, 0)
      }

      dateRequestMap.set(date, dateRequestMap.get(date) + 1)
    })

    // Prepare data for chart
    const chartData = Array.from(dateRequestMap.entries()).map(([date, requestCount]) => {
      return {
        date,
        insightLikes: requestCount
      }
    })

    // Sort the data by date
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return chartData
  } catch (error) {
    console.error('Error querying friend requests:', error)
    throw error
  }
}
