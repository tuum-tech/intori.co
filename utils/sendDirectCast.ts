import axios from 'axios'
import { v4 as uuid } from 'uuid'

const WARPCAST_API_KEY = process.env.WARPCAST_API_KEY

export const sendDirectCast = async (params: {
  recipientFid: number
  message: string
}): Promise<void> => {
  await axios.put(
    "https://api.warpcast.com/v2/ext-send-direct-cast",
    {
      ...params,
      idempotencyKey: uuid()
    },
    {
      headers: {
        Authorization: `Bearer ${WARPCAST_API_KEY}`
      },
    }
  )
}
