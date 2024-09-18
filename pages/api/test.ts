import type { NextApiRequest, NextApiResponse } from 'next'
import { doesUserAlreadyFollowUser } from '../../models/userFollowings'

const test = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const follows = await doesUserAlreadyFollowUser(897, 2745)

  console.log({ follows })

  return res.send(`<h1>Done.</h1>`)
}

export default test
