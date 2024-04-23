import type { NextApiRequest, NextApiResponse } from 'next'

const submitFrame = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  console.log({
    origin: req.headers.origin,
    referer: req.headers.referer,
  })

  console.log('body:', req.body)

  const frameSequenceName = req.headers.referer?.split('/').pop()
  const currentStepOfSequence = parseInt(req.query.step as string, 10) || 0

  console.log({ frameSequenceName, currentStepOfSequence })

  return res.redirect(`/frames/initial?step=${currentStepOfSequence + 1}`)
}

export default submitFrame
