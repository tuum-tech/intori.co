import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  loadKumbSans24
} from '../../../utils/frames/fonts'
// import { fetchUserDetailsByFids } from '../../../utils/neynarApi'

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

  const reason = req.query.sur as string
  // const suggestedUserFid = parseInt(req.query.su as string, 10)
  // const [suggestedUserData] = await fetchUserDetailsByFids([suggestedUserFid])

  // TODO: get suggested user data. we need avatar, username, display name, and bio
  // TODO: count total responses for suggested user
  // TODO: get last cast time ago for suggested user
  // TODO: get answers in common with suggested user

  const font24 = await loadKumbSans24()

  baseImage.print(
    font24,
    60,
    334,
    {
      text: reason,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    648,
    95
  )

  const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG)

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
