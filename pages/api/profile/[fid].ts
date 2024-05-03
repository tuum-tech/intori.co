import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  getUserProfilePictureFromFid
} from '../utils/farcasterServer'
import {
  countUserAnswers,
  findLongestStreak
} from '../../../models/userAnswers'
import { loadKumbSans32 } from '../../../utils/frames/fonts'

async function createCircularImage(url: string, baseImage: Jimp): Promise<Jimp> {
  try {
    const urlImage = await Jimp.read(url)

    const maskImage = await Jimp.read(
      path.join(process.cwd(), 'public/frame_template_mask.png')
    )

    maskImage.resize(85, 85)
    urlImage.resize(85, 85)

    urlImage.mask(maskImage, 0, 0)

    baseImage.composite(urlImage, 440, 133.5)

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

  const questionsAnswered = await countUserAnswers(fid)
  const pointsEarned = questionsAnswered * 2
  const currentStreakDays = await findLongestStreak(fid)
  const streakText = currentStreakDays === 1 ? '1 day' : `${currentStreakDays} days`

  const font = await loadKumbSans32()
  baseImageWithProfilePic.print(font, 613, 228.5, questionsAnswered.toString())
  baseImageWithProfilePic.print(font, 613, 300.5, pointsEarned.toString())
  baseImageWithProfilePic.print(font, 613, 372, streakText)

  const buffer = await baseImageWithProfilePic.getBufferAsync(Jimp.MIME_PNG)

  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
