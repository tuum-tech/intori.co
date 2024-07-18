import Jimp from 'jimp'
import { Font } from '@jimp/plugin-print'
import * as path from 'path'
import { intoriQuestions, IntoriQuestionType } from './intoriFrameForms'
import {
  loadKumbSans46,
  loadKumbSans26
} from './fonts'

let kumbhSans46: Font
let kumbhSans26: Font

const loadFonts = async () => {
  kumbhSans46 = await loadKumbSans46()
  kumbhSans26 = await loadKumbSans26()
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

  console.log('Done generating question frame images.')
}

generateQuestionnaireStepImages()
