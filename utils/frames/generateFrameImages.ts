import Jimp from 'jimp'
import { Font } from '@jimp/plugin-print'
import * as path from 'path'
import { getAvailableQuestions, IntoriQuestionType } from './questions'
import { channelFrames } from './channelFrames'
import {
  loadFont,
} from './fonts'

let kumbhSans46: Font
let kumbhSans26: Font

const loadFonts = async () => {
  kumbhSans46 = await loadFont({
    family: 'kumbh_sans',
    size: 46,
    weight: 'regular',
    color: 'white'
  })

  kumbhSans26 = await loadFont({
    family: 'kumbh_sans',
    size: 26,
    weight: 'medium',
    color: 'white'
  })
}

const generateQuestionnaireStepImage = async (
  intoriQuestion: IntoriQuestionType
): Promise<Jimp> => {
  const { question, answers } = intoriQuestion

  await loadFonts()

  const image = await Jimp.read(
    path.join(
      process.cwd(),
      'public/assets/templates/question_frame_template.png'
    )
  )

  image.print(
    kumbhSans46,
    26,
    171,
    {
      text: question,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    715,
    245
  )

  const bullet = await Jimp.read(
    path.join(process.cwd(), 'public/assets/templates/answer-bullet.png')
  )

  const leftColumnX = 129
  const rightColumnX = 416
  const rowOffset = 60

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i]
    const bulletXPosition = i % 2 === 0 ? leftColumnX : rightColumnX
    const bulletYPosition = 449 + Math.floor(i / 2) * rowOffset

    // add bullet point image
    image.composite(bullet, bulletXPosition, bulletYPosition)

    // answer text
    image.print(
      kumbhSans26,
      bulletXPosition + 27,
      bulletYPosition - 20,
      {
        text: answer,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      260,
      57
    )
  }

  return image
}

export const generateQuestionnaireStepImages = async () => {
  const questionImagePathPrefix = path.join(
    process.cwd(),
    'public/assets/frames/questions'
  )

  const intoriQuestions = getAvailableQuestions()

  for (let i = 0; i < intoriQuestions.length; i++) {
    const questionIndex = i

    const intoriQuestion = intoriQuestions[questionIndex]

    const questionImagePath = path.join(
      questionImagePathPrefix,
      questionIndex.toString() + '.png'
    )

    const image = await generateQuestionnaireStepImage(intoriQuestion)

    image.write(questionImagePath)
  }

  for (let i = 0; i < channelFrames.length; i++) {
    const channelQuestions = getAvailableQuestions({
      channelId: channelFrames[i].channelId
    })

    const channelQuestionImagePathPrefix = path.join(
      questionImagePathPrefix,
      channelFrames[i].channelId
    )

    for (let channelQuestionIndex = 0; channelQuestionIndex < channelQuestions.length; channelQuestionIndex++) {
      const channelQuestion = channelQuestions[channelQuestionIndex]

      const channelQuestionImagePath = path.join(
        channelQuestionImagePathPrefix,
        channelQuestionIndex.toString() + '.png'
      )

      const image = await generateQuestionnaireStepImage(channelQuestion)

      image.write(channelQuestionImagePath)
    }
  }

  console.log('Done generating question frame images.')
}

generateQuestionnaireStepImages()
