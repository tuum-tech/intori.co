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
  const fidThatCastedFrame = req.body.untrustedData.castId.fid

  if (intoriFrameForms[frameSequenceName] === undefined) {
    throw new Error(`Frame sequence name ${frameSequenceName} is not a valid frame sequence name.`)
  }

  const getCurrentStep = () => {
    if (!currentStepOfSequence) {
      return introductionStep
    }

    if (
      currentStepOfSequence === intoriFrameForms[frameSequenceName].steps.length + 1
    ) {
      return finalStep
    }

    return intoriFrameForms[frameSequenceName].steps[currentStepOfSequence - 1]
  }

  const getButtonLabels = () => {
    console.log({ 
      currentStepOfSequence,
      currentStep: getCurrentStep(),
      stepsLength: intoriFrameForms[frameSequenceName].steps.length
    })

    if (!getCurrentStep()) {
      return []
    }

    return (
      getCurrentStep()
      .inputs
      .map(input => input.content)
    )
  }

  return {
    fidThatCastedFrame,
    fid,
    buttonIndex,
    frameSequenceName,
    frameSequenceObject: intoriFrameForms[frameSequenceName],
    currentStepOfSequence,
    currentStepObject: getCurrentStep(),
    buttonLabels: getButtonLabels(),
    buttonClicked: getButtonLabels()[buttonIndex - 1]
  }
}
