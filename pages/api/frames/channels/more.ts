import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import { inPublicFolder } from '../../../../utils/paths'
import {
  loadFont
} from '../../../../utils/frames/fonts'
import { getAllChannelFrames } from '@/models/channelFrames'

const createIntoriChannelsInfoFrame = async (
  _: NextApiRequest,
  res: NextApiResponse
) => {
  const [
    allChannelFrames,
    font24regularWhite,
    baseImage,
    answerBulletPoint
  ] = await Promise.all([
    getAllChannelFrames(),
    loadFont({ family: 'kumbh_sans', weight: 'regular', size: 24, color: 'white' }),
    Jimp.read(inPublicFolder('/assets/templates/intori_channels_frame.png')),
    Jimp.read(inPublicFolder('/assets/templates/answer-bullet.png')),
  ])

  // draw answer bullet points
  const leftColumnX = 129
  const rightColumnX = 450
  const rowOffset = 55

  for (let i = 0; i < allChannelFrames.length; i++) {
    const channel = allChannelFrames[i]
    const bulletXPosition = i % 2 === 0 ? leftColumnX : rightColumnX
    const bulletYPosition = 449 + (Math.floor(i / 2) * rowOffset)

    baseImage.composite(answerBulletPoint, bulletXPosition, bulletYPosition)

    if (i === 9 && allChannelFrames.length > 10) {
      baseImage.print(
        font24regularWhite,
        bulletXPosition + 28,
        bulletYPosition - 9,
        {
          text: `+${allChannelFrames.length - 10} more`,
          alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        },
        261,
        30
      )

      break
    }

    baseImage.print(
      font24regularWhite,
      bulletXPosition + 28,
      bulletYPosition - 9,
      {
        text: `/${channel.channelId}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      261,
      30
    )
  }

  const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG)

  return res.status(200).send(buffer)
}

export default createIntoriChannelsInfoFrame
