import { createDb } from '../pages/api/utils/firestore'

export type FriendRequestType = {
  fromFid: number
  toFid: number
  status: "pending" | "accepted" | "rejected"
  createdAt: number
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  collection = db.collection('friendRequest')
  return collection
}

export const countTotalFriends = async (fid: number): Promise<number> => {
  const col = getCollection()
  const query = await col
    .where("fromFid", "==", fid)
    .where("status", "==", "accepted")
    .get()

  const sentToMe = await col
    .where("toFid", "==", fid)
    .where("status", "==", "accepted")
    .get()

  return query.size + sentToMe.size
}

export const getFriendRequestsOverTime = async (options: {
  startDate: number,
  endDate: number,
}): Promise<Array<{ date: string, friendRequests: number }>> => {
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
      const data = doc.data() as FriendRequestType
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
        friendRequests: requestCount
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
