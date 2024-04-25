import type { NextApiRequest } from 'next'
import {
  intoriFrameForms,
  introductionStep,
  finalStep
} from './intoriFrameForms'

export const frameSubmissionHelpers = (req: NextApiRequest) => {
  const frameSequenceName = req.body.untrustedData.url.split('/').pop().split('?')[0] as string
  const currentStepOfSequence = parseInt(req.query.step as string, 10) || 0
  const fid = req.body.untrustedData.fid
  const buttonIndex = req.body.untrustedData.buttonIndex

  if (intoriFrameForms[frameSequenceName] === undefined) {
    throw new Error(`Frame sequence name ${frameSequenceName} is not a valid frame sequence name.`)
  }

  const getButtonLabels = () => {
    if (!currentStepOfSequence) {
      return (
        introductionStep
        .inputs
        .map(input => input.content)
      )
    }

    if (currentStepOfSequence === intoriFrameForms[frameSequenceName].steps.length) {
      return (
        finalStep
        .inputs
        .map(input => input.content)
      )
    }

    return (
      intoriFrameForms[frameSequenceName]
      .steps[currentStepOfSequence]
      .inputs
      .map(input => input.content)
    )
  }

  return {
    fid,
    buttonIndex,
    frameSequenceName,
    currentStepOfSequence,
    buttonLabels: getButtonLabels(),
    buttonClicked: getButtonLabels()[buttonIndex - 1]
  }
}
