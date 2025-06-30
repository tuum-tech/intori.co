import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "@/prisma"

const enableClaimsForUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(404).end()
    }

    const session = await getSession({ req })

    if (!session?.user?.fid || !session?.admin) {
      return res.status(404).end()
    }

    const fid = parseInt(req.query?.fid?.toString() || '', 10)

    if (!fid) {
      return res.status(404).end()
    }

    await prisma.spamScore.update({
      where: { fid },
      data: { preventClaiming: false }
    })

    return res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ 
      items: [],
      hasMore: false,
      nextCursor: undefined
    })
  }
}

export default enableClaimsForUser
