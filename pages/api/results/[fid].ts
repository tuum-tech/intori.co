import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  loadKumbSans20,
  loadKumbSans26
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
      path.join(process.cwd(), 'public/assets/templates/results_frame_template.png')
  )

  const suggestedUserName = req.query.su as string
  const suggestedUserReason = req.query.sur as string

  const suggestedChannel = req.query.sc as string

  // adding the number stats
  const font26 = await loadKumbSans26()
  const font20 = await loadKumbSans20()

  baseImage.print(
    font20,
    190,
    226,
    {
      text: 'You earned 2 points, Share for 25 more!',
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    448,
    32
  )

  if (suggestedUserName && suggestedUserReason) {
    const suffix = suggestedUserReason.split('You')[1].trim()
    const text = `You and @${suggestedUserName} ${suffix}`
    baseImage.print(
      font20,
      60,
      270,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      648,
      95
    )
  }

  if (suggestedChannel) {
    const text = `Users that have similar answers follow /${suggestedChannel}`

    baseImage.print(
      font20,
      152,
      360,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      464,
      95
    )
  }

  if (!suggestedUserName && !suggestedChannel) {
    const text = 'Keep Going! Your next recommendations will be even sharper.'
    baseImage.print(
      font26,
      60,
      270,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      648,
      95
    )
  }

  const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG)

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
