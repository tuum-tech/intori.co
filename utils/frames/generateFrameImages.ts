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
  question: string,
  step: number
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

  const offStepImagePath = path.join(
    process.cwd(),
    'public/assets/templates/dot_off.png'
  )

  const onStepImagePath = path.join(
    process.cwd(),
    'public/assets/templates/dot_on.png'
  )

  const onStepImage = await Jimp.read(onStepImagePath)
  const offStepImage = await Jimp.read(offStepImagePath)

  // [252, 342, 432]
  for (let i = 1; i < 4; i++) {
    const stepOffsetX = 252 + ((i - 1) * 90)

    if (i <= step) {
      image.composite(
        onStepImage,
        stepOffsetX,
        52,
        {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 1,
          opacityDest: 1
        }
      )
    } else {
      image.composite(
        offStepImage,
        stepOffsetX,
        52,
        {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 1,
          opacityDest: 1
        }
      )
    }
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

    const { question } = intoriQuestions[questionIndex]

    // for each question, we need to generate step 1, 2, and 3 step versions of the question

    for (let step = 1; step < 4; step++) {
      const questionImagePath = path.join(
        questionImagePathPrefix,
        questionIndex.toString() + `_${step}` + '.png'
      )

      const image = await generateQuestionnaireStepImage(question, step)

      image.write(questionImagePath)
    }
  }

  console.log('Done generating question frame images.')
}

generateQuestionnaireStepImages()
