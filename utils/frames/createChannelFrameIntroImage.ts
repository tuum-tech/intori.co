import Jimp from 'jimp'
import { inPublicFolder } from '../../utils/paths'
import {
  loadFont
} from './fonts'
import {
  removeEmojis,
  shortenNumber
} from '../textHelpers'

const addChannelImage = async (
  baseImage: Jimp,
  channelImage: Jimp
) => {
  channelImage.contain(244, 198, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)

  // area where channel image will be within
  const areaX = 272
  const areaY = 282
  const areaWidth = 244
  const areaHeight = 198

  const x = areaX + (areaWidth - channelImage.bitmap.width) / 2
  const y = areaY + (areaHeight - channelImage.bitmap.height) / 2

  // Composite the avatar onto the base image at the calculated position
  baseImage.composite(channelImage, x, y);
}

export const createChannelFrameIntroImage = async (params: {
  name: string
  imageUrl: string
  followCount: number
}): Promise<Buffer> => {
  const [
    font14regularGrey,
    font24semiboldGrey,
    baseImage,
    channelImage
  ] = await Promise.all([
    loadFont({ family: 'kumbh_sans', weight: 'regular', size: 14, color: 'grey' }),
    loadFont({ family: 'kumbh_sans', weight: 'semibold', size: 24, color: 'grey' }),
    Jimp.read(inPublicFolder('/assets/templates/channel_intro_template.png')),
    Jimp.read(params.imageUrl)
  ]);

  // followers amount
  baseImage.print(
    font14regularGrey,
    359,
    248,
    {
      text: `${shortenNumber(params.followCount)} Followers`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    157,
    18
  )

  await addChannelImage(baseImage, channelImage)

  // Channel name
  baseImage.print(
    font24semiboldGrey,
    264,
    491,
    {
      text: removeEmojis(params.name),
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    242,
    32
  )

  return baseImage.getBufferAsync(Jimp.MIME_PNG)
}
