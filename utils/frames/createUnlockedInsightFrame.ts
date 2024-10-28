import Jimp from 'jimp'
import { inPublicFolder } from '../../utils/paths'
import { UserAnswerType } from '../../models/userAnswers'
import {
  loadFont
} from './fonts'

const addChannelImage = async (
  baseImage: Jimp,
  circleMask: Jimp,
  channelImage: Jimp
) => {
    const circleImageSize = 58
    circleMask.resize(circleImageSize, circleImageSize)

    const scale = Math.max(circleImageSize / channelImage.bitmap.width, circleImageSize / channelImage.bitmap.height)
    channelImage.scale(scale)

    const x = (channelImage.bitmap.width - circleImageSize) / 2
    const y = (channelImage.bitmap.height - circleImageSize) / 2

    channelImage.crop(x, y, circleImageSize, circleImageSize)

    channelImage.mask(circleMask, 0, 0)

    baseImage.composite(channelImage, 91, 177)
}

export const createUnlockedInsightFrame = async (params: {
  answers: UserAnswerType[]
  channelImageUrl: string
}): Promise<Buffer> => {
  const { answers, channelImageUrl } = params

  const [
    font21regularWhite,
    baseImage,
    channelImage,
    circleMask
  ] = await Promise.all([
    loadFont({ family: 'kumbh_sans', weight: 'regular', size: 21, color: 'white' }),
    Jimp.read(inPublicFolder(`/assets/templates/unlocked_insights_frame_${answers.length}.png`)),
    Jimp.read(channelImageUrl),
    Jimp.read(inPublicFolder('/assets/templates/circle_mask.png')),
  ])

  await addChannelImage(baseImage, circleMask, channelImage)

  let yOffset = 0
  const yOffsetIncrement = 113

  for (let i = 0; i < answers.length; i++) {
    const { question, answer } = answers[i]

    // draw question
    baseImage.print(
      font21regularWhite,
      161,
      197 + yOffset,
      {
        text: question,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      },
      509,
      49
    )

    // draw answer
    baseImage.print(
      font21regularWhite,
      161,
      247 + yOffset,
      {
        text: answer,
        alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      494,
      33
    )

    yOffset += yOffsetIncrement
  }

  return baseImage.getBufferAsync(Jimp.MIME_PNG)
}
