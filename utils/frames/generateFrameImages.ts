import Jimp from 'jimp'
import { Font } from '@jimp/plugin-print'
import * as path from 'path'
import { intoriFrameForms } from './intoriFrameForms'
import {
  loadKumbSans30,
  loadKumbSans50
} from './fonts'
import { camelCaseToTitleCase } from '../textHelpers'

let kumbhSans50: Font
let kumbhSans30: Font

const loadFonts = async () => {
  kumbhSans50 = await loadKumbSans50()
  kumbhSans30 = await loadKumbSans30()
}

const generateQuestionnaireStepImage = async (
  title: string,
  subtitle: string,
): Promise<Jimp> => {
  await loadFonts()

  const image = await Jimp.read(
    path.join(
      process.cwd(),
      'public/assets/frames/step_template.png'
    )
  )

  image.print(
    kumbhSans50,
    25,
    236,
    {
      text: title,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    718,
    62
  )

  image.print(
    kumbhSans30,
    25,
    330,
    {
      text: subtitle,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    718,
    37
  )

  return image
}

export const generateQuestionnaireStepImages = async () => {
  const sequences = Object.keys(intoriFrameForms)
  const pathPrefix = path.join(
    process.cwd(),
    'public/assets/frames'
  )
  for ( let i = 0; i < sequences.length; i++ ) {
    const sequence = intoriFrameForms[sequences[i]]

    const framePathPrefix = path.join(
      pathPrefix,
      sequence.name
    )

    const firstFrame = await generateQuestionnaireStepImage(
    camelCaseToTitleCase(sequence.name),
      'Daily suggested follows and channels for you'
    )

    firstFrame.writeAsync(path.join(framePathPrefix, '/1.png'))

    for (let stepIndex = 0; stepIndex < sequence.steps.length; stepIndex++) {
      const step = sequence.steps[stepIndex]
      if (!step.question) {
        continue
      }

      const stepImage = await generateQuestionnaireStepImage(
       camelCaseToTitleCase(step.title),
        step.question
      )

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
