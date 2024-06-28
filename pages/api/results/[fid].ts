import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  loadKumbSans20,
  loadKumbSans24
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

  const lastStepFrame = !!req.query.last

  const font20 = await loadKumbSans20()
  const font24 = await loadKumbSans24()

  if (lastStepFrame) {
    // only show on last step
    baseImage.print(
      font20,
      201,
      202,
      {
        text: 'You earned 6 points, Share for 25 more!',
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      448,
      32
    )
  }

  if (suggestedUserName && suggestedUserReason) {
    baseImage.print(
      font24,
      60,
      334,
      {
        text: suggestedUserReason,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      648,
      95
    )
  } else {
    baseImage.print(
      font24,
      60,
      334,
      {
        text: 'Keep Going! Your next recommendations will be even sharper.',
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
      font24,
      197,
      242,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      375,
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
