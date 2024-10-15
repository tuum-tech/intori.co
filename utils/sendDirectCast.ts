import axios, { isAxiosError } from 'axios'
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

export const notifySuperAdminOfError = async (error: unknown, where: string): Promise<void> => {
  const superAdminFids = (
    process.env.SUPER_ADMIN_FIDS ?? ''
  ).split(',').map((fid) => parseInt(fid, 10))

  if (isAxiosError(error) && error.response) {
    const { status, statusText, data } = error.response

    await Promise.all(
      superAdminFids.map((fid) => sendDirectCast({
        recipientFid: fid,
        message: `${where} Error: ${error?.config?.url} ${status} ${statusText} ${JSON.stringify(data)}`
      }))
    )

    return
  }

  await Promise.all(
    superAdminFids.map((fid) => sendDirectCast({
      recipientFid: fid,
      message: `${where} Error: ${(error as Error)?.message}`
    }))
  )
}
