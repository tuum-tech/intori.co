import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  countUserAnswers,
  findCurrentStreak
} from '../../../models/userAnswers'
import {
  loadKumbSans50
} from '../../../utils/frames/fonts'

// Note: This is used to create a circle masked image
//
// async function createCircularImage(url: string, baseImage: Jimp): Promise<Jimp> {
//   try {
//     const urlImage = await Jimp.read(url)
// 
//     const maskImage = await Jimp.read(
//       path.join(process.cwd(), 'public/frame_template_mask.png')
//     )
// 
//     maskImage.resize(85, 85)
//     urlImage.resize(85, 85)
// 
//     urlImage.mask(maskImage, 0, 0)
// 
//     baseImage.composite(urlImage, 440, 133.5)
// 
//     return baseImage
//   } catch (error) {
//     console.error('Error creating circular image:', error)
//     throw error
//   }
// }

const getProfileFramePictureImage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const baseImage = await Jimp.read(
      path.join(process.cwd(), 'public/assets/frames/results_frame_template.png')
  )

  const fid = parseInt(req.query.fid as string, 10)

  // const profilePictureUrl = await getUserProfilePictureFromFid(fid)
  // const baseImageWithProfilePic = await createCircularImage(profilePictureUrl, baseImage)

  const questionsAnswered = await countUserAnswers(fid)
  const pointsEarned = questionsAnswered * 2
  const currentStreakDays = await findCurrentStreak(fid)
  const streakText = currentStreakDays === 1 ? '1 day' : `${currentStreakDays} days`

  // adding the number stats
  const font = await loadKumbSans50()

  const addStatNumber = (
    x: number,
    y: number,
    text: string
  ) => {
    baseImage.print(
      font,
      x,
      y,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      216,
      102
    )
  }

  addStatNumber(46, 154, questionsAnswered.toString())
  addStatNumber(279, 154, pointsEarned.toString())
  addStatNumber(509, 154, streakText)

  const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG)

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
