import Jimp from 'jimp'
import { inPublicFolder } from '../../utils/paths'
import { QuestionType } from '../../models/questions'
import {
  loadFont
} from './fonts'

const addChannelImage = async (
  baseImage: Jimp,
  circleMask: Jimp,
  channelImage: Jimp
) => {
    const circleImageSize = 76
    circleMask.resize(circleImageSize, circleImageSize)

    const scale = Math.max(circleImageSize / channelImage.bitmap.width, circleImageSize / channelImage.bitmap.height)
    channelImage.scale(scale)

    const x = (channelImage.bitmap.width - circleImageSize) / 2
    const y = (channelImage.bitmap.height - circleImageSize) / 2

    channelImage.crop(x, y, circleImageSize, circleImageSize)

    channelImage.mask(circleMask, 0, 0)

    baseImage.composite(channelImage, 346, 39)
}

export const createChannelQuestionFrameImage = async (params: {
  question: QuestionType
  channelImageUrl: string
}): Promise<Buffer> => {
  const { question, channelImageUrl } = params

  const [
    font24regularWhite,
    font40mediumBlack, // TODO: create fnt
    baseImage,
    channelImage,
    answerBulletPoint,
    circleMask
  ] = await Promise.all([
    loadFont({ family: 'kumbh_sans', weight: 'regular', size: 24, color: 'white' }),
    loadFont({ family: 'kumbh_sans', weight: 'medium', size: 40, color: 'black' }),
    Jimp.read(inPublicFolder('/assets/templates/question_frame_template.png')),
    Jimp.read(channelImageUrl),
    Jimp.read(inPublicFolder('/assets/templates/answer-bullet.png')),
    Jimp.read(inPublicFolder('/assets/templates/circle_mask.png')),
  ])

  await addChannelImage(baseImage, circleMask, channelImage)

  // draw question
  baseImage.print(
    font40mediumBlack,
    54,
    169,
    {
      text: question.question,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    670,
    213
  )

  // draw answer bullet points
  const leftColumnX = 129
  const rightColumnX = 450
  const rowOffset = 55

  for (let i = 0; i < question.answers.length; i++) {
    const answer = question.answers[i]
    const bulletXPosition = i % 2 === 0 ? leftColumnX : rightColumnX
    const bulletYPosition = 449 + (Math.floor(i / 2) * rowOffset)

    baseImage.composite(answerBulletPoint, bulletXPosition, bulletYPosition)

    // answer text
    baseImage.print(
      font24regularWhite,
      bulletXPosition + 28,
      bulletYPosition - 9,
      {
        text: answer,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      261,
      30
    )
  }

  return baseImage.getBufferAsync(Jimp.MIME_PNG)
}
