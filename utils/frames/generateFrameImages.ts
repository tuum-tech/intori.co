import Jimp from 'jimp'
import { Font } from '@jimp/plugin-print'
import * as path from 'path'
import * as fs from 'fs'
import { intoriFrameForms } from './intoriFrameForms'
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
    361,
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
  const sequences = Object.keys(intoriFrameForms)

  const finalFramePathPrefix = path.join(
    process.cwd(),
    'public/assets/frames'
  )

  const templatesPathPrefix = path.join(
    process.cwd(),
    'public/assets/templates'
  )

  for ( let i = 0; i < sequences.length; i++ ) {
    const sequence = intoriFrameForms[sequences[i]]

    const framePathPrefix = path.join(
      finalFramePathPrefix,
      sequence.name
    )

    fs.copyFileSync(
      path.join(templatesPathPrefix, 'intro_frame_template.png'),
      path.join(framePathPrefix, '1.png')
    )

    for (let stepIndex = 0; stepIndex < sequence.steps.length; stepIndex++) {
      const step = sequence.steps[stepIndex]
      if (!step.question) {
        continue
      }

      const stepImage = await generateQuestionnaireStepImage(step.question)

      await stepImage.writeAsync(
        path.join(
          framePathPrefix,
          `${stepIndex + 2}.png`
        )
      )
    }
  }
  console.log('Done generating questionnaire step images.')
}

generateQuestionnaireStepImages()
