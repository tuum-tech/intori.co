import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import { getUserProfilePictureFromFid } from '../utils/farcasterServer'

async function createCircularImage(url: string, baseImage: Jimp): Promise<Jimp> {
  try {
    const urlImage = await Jimp.read(url)
    const maskImage = await Jimp.read(path.join(__dirname, '..', '..', '..', '..', '..', 'frame_template_mask.png'))

    maskImage.resize(170, 170)
    urlImage.resize(170, 170)

    urlImage.mask(maskImage, 0, 0)

    baseImage.composite(urlImage, 880, 267)

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
    path.join(__dirname, '..', '..', '..', '..', '..', 'frame_template.png')
  )

  const fid = parseInt(req.query.fid as string, 10)

  const profilePictureUrl = await getUserProfilePictureFromFid(fid)
  const baseImageWithProfilePic = await createCircularImage(profilePictureUrl, baseImage)

  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
  baseImageWithProfilePic.print(font, 1226, 457, '1') // number questions answered
  baseImageWithProfilePic.print(font, 1226, 601, '2') // number points earned
  baseImageWithProfilePic.print(font, 1226, 744, '3 days') // current streak in days

  const buffer = await baseImageWithProfilePic.getBufferAsync(Jimp.MIME_PNG)

  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
