import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  getUserProfilePictureFromFid
} from '../utils/farcasterServer'
// import {
//   countUserAnswers,
//   findLongestStreak
// } from '../../../models/userAnswers'

async function createCircularImage(url: string, baseImage: Jimp): Promise<Jimp> {
  try {
    const urlImage = await Jimp.read(url)

    const maskImage = await Jimp.read(
      path.join(process.cwd(), 'public/frame_template_mask.png')
    )

    maskImage.resize(170/2, 170/2)
    urlImage.resize(170/2, 170/2)

    urlImage.mask(maskImage, 0, 0)

    baseImage.composite(urlImage, 880/2, 267/2)

    return baseImage
  } catch (error) {
    console.error('Error creating circular image:', error)
    throw error
  }
}

const getProfileFramePictureImage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const baseImage = await Jimp.read(
      path.join(process.cwd(), 'public/frame_template.png')
  )

  const fid = parseInt(req.query.fid as string, 10)

  const profilePictureUrl = await getUserProfilePictureFromFid(fid)
  const baseImageWithProfilePic = await createCircularImage(profilePictureUrl, baseImage)

  // const questionsAnswered = await countUserAnswers(fid)
  const questionsAnswered = 38
  const pointsEarned = questionsAnswered * 2
  // const currentStreakDays = await findLongestStreak(fid)
  const currentStreakDays = 1
  const streakText = currentStreakDays === 1 ? '1 day' : `${currentStreakDays} days`

  console.log({
    'fnt exists': path.resolve(process.cwd(), 'public/fonts/open-sans/open-sans-32-white/open-sans-32-white.fnt'),
    'png exists': path.resolve(process.cwd(), 'public/fonts/open-sans/open-sans-32-white/open-sans-32-white.png')
  })

  const font = await Jimp.loadFont(
    path.join(process.cwd(), 'public/fonts/open-sans/open-sans-32-white/open-sans-32-white.fnt'),
  )
  baseImageWithProfilePic.print(font, 1226/2, 457/2, questionsAnswered.toString())
  baseImageWithProfilePic.print(font, 1226/2, 601/2, pointsEarned.toString())
  baseImageWithProfilePic.print(font, 1226/2, 744/2, streakText)

  const buffer = await baseImageWithProfilePic.getBufferAsync(Jimp.MIME_PNG)

  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
