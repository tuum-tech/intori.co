import Jimp from 'jimp'
import { Font } from '@jimp/plugin-print'
import * as path from 'path'
import { intoriQuestions } from './intoriFrameForms'
import {
  loadKumbSans30
} from './fonts'

let kumbhSans30: Font

const loadFonts = async () => {
  kumbhSans30 = await loadKumbSans30()
}

const generateQuestionnaireStepImage = async (
  question: string
): Promise<Jimp> => {
  await loadFonts()

  const image = await Jimp.read(
    path.join(
      process.cwd(),
      'public/assets/templates/question_frame_template.png'
    )
  )

  image.print(
    kumbhSans30,
    103,
    341,
    {
      text: question,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    562,
    74
  )

  return image
}

export const generateQuestionnaireStepImages = async () => {
  const questionImagePathPrefix = path.join(
    process.cwd(),
    'public/assets/frames/questions'
  )

  for (let i = 0; i < intoriQuestions.length; i++) {
    const questionIndex = i

    const { question } = intoriQuestions[questionIndex]

    const questionImagePath = path.join(
      questionImagePathPrefix,
      questionIndex.toString() + '.png'
    )

    const image = await generateQuestionnaireStepImage(question)

    image.write(questionImagePath)
  }

  console.log('Done generating question frame images.')
}

generateQuestionnaireStepImages()
