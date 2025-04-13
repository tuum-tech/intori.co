import { createDb } from '../pages/api/utils/firestore'

export type UserGiftType = {
  id: string
  sentFromFid: number
  sentToFid: number
  opened: boolean
  createdAt: number

  // this gift is a sent back gift
  sentBackGiftFor?: string

  // a gift was sent back for this git
  sentGiftBack?: boolean

  unlocked?: boolean
  isSuperGift?: boolean
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  collection = db.collection('userGifts')
  return collection
}

export const countGiftsSent = async (fid: number): Promise<number> => {
  const col = getCollection()

  const query = await col
    .where('sentFromFid', '==', fid)
    .get()

  return query.size
}

export const getGiftsSentOverTime = async (options: {
  startDate: number,
  endDate: number,
}): Promise<Array<{ date: string, giftsSent: number }>> => {
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
    const dateGiftMap = new Map()

    snapshot.forEach(doc => {
      const data = doc.data() as UserGiftType
      const date = new Date(data.createdAt).toISOString().split('T')[0] // Group by day

      if (!dateGiftMap.has(date)) {
        dateGiftMap.set(date, 0)
      }

      dateGiftMap.set(date, dateGiftMap.get(date) + 1)
    })

    // Prepare data for chart
    const chartData = Array.from(dateGiftMap.entries()).map(([date, giftCount]) => {
      return {
        date,
        giftsSent: giftCount
      }
    })

    // Sort the data by date
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return chartData
  } catch (error) {
    console.error('Error querying user gifts:', error)
    throw error
  }
}
