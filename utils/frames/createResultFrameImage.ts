import Jimp from 'jimp'
import { inPublicFolder } from '../../utils/paths'
import {
  loadFont
} from './fonts'
import {
  replaceNewlinesWithSpaces,
  removeEmojis
} from '../textHelpers'

const createAvatar = async (url: string, baseImage: Jimp): Promise<void> => {
  try {
    const urlImage = await Jimp.read(url);

    const maskImage = await Jimp.read(inPublicFolder('/assets/templates/circle_mask.png'))

    const circleImageSize = 192;

    // Resize the mask to the desired circle size
    maskImage.resize(circleImageSize, circleImageSize);

    // Calculate the scale to fill the circle mask without stretching
    const scale = Math.max(circleImageSize / urlImage.bitmap.width, circleImageSize / urlImage.bitmap.height);

    // Resize the image proportionally
    urlImage.scale(scale);

    // Calculate the dimensions to crop the image to fit the circle mask
    const x = (urlImage.bitmap.width - circleImageSize) / 2;
    const y = (urlImage.bitmap.height - circleImageSize) / 2;

    // Crop the image to ensure it covers the circle mask completely
    urlImage.crop(x, y, circleImageSize, circleImageSize);

    // Apply the mask to the cropped image
    urlImage.mask(maskImage, 0, 0);

    // Composite the result onto the base image
    baseImage.composite(urlImage, 93, 119);
  } catch (error) {
    console.error('Error creating circular image:', error)
    throw error
  }
}

const addPowerBadge = async (baseImage: Jimp): Promise<void> => {
  const powerBadge = await Jimp.read(
    inPublicFolder('/assets/templates/powerbadge.png')
  )

  baseImage.composite(powerBadge, 238, 119, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacitySource: 1,
    opacityDest: 1
  })
}

export const createFrameResultImage = async (params: {
  displayName: string
  username: string
  underUsernameText: string
  avatarUrl: string
  powerBadge: boolean
  topLeftText: string
  topRightText: string
  bio: string
  mainReason: string
  underReasonText: string
}): Promise<Buffer> => {
  const font18black = await loadFont({
    family: 'kumbh_sans',
    weight: 'regular',
    size: 18,
    color: 'black'
  })

  const font21black = await loadFont({
    family: 'kumbh_sans',
    weight: 'regular',
    size: 21,
    color: 'black'
  })

  const font24grey = await loadFont({
    family: 'kumbh_sans',
    weight: 'regular',
    size: 24,
    color: 'grey'
  })

  const font32black = await loadFont({
    family: 'kumbh_sans',
    weight: 'bold',
    size: 32,
    color: 'black'
  })

  const font28white = await loadFont({
    family: 'kumbh_sans',
    weight: 'semibold',
    size: 28,
    color: 'white'
  })

  const baseImage = await Jimp.read(
      inPublicFolder('/assets/templates/results_frame_template.png')
  )

  // display name
  baseImage.print(
    font32black,
    318,
    122,
    {
      text: removeEmojis(replaceNewlinesWithSpaces(params.displayName)),
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
    },
    356,
    74
  )

  // username
  baseImage.print(
    font24grey,
    318,
    208,
    {
      text: params.username,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    356,
    26
  )

  // fid line
  if (params.underUsernameText) {
    baseImage.print(
      font18black,
      318,
      244,
      {
        text: params.underUsernameText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      356,
      26
    )
  }

  // avatar
  await createAvatar(
    params.avatarUrl,
    baseImage
  )

  // power badge on avatar
  if (params.powerBadge) {
    await addPowerBadge(baseImage)
  }

  // total responses
  baseImage.print(
    font18black,
    119,
    62,
    {
      text: params.topLeftText,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    118,
    26
  )

  // last cast
  baseImage.print(
    font18black,
    415,
    62,
    {
      text: params.topRightText,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    217,
    26
  )

  // bio
  baseImage.print(
    font21black,
    107,
    336,
    {
      text: removeEmojis(replaceNewlinesWithSpaces(params.bio)),
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    },
    552,
    100
  )

  // first reason
  baseImage.print(
    font28white,
    104,
    455,
    {
      text: params.mainReason,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    557,
    159
  )

  // +N other responses
  if (params.underReasonText) {
    baseImage.print(
      font18black,
      107,
      630,
      {
        text: params.underReasonText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      356,
      26
    )
  }

  return baseImage.getBufferAsync(Jimp.MIME_PNG)
}
