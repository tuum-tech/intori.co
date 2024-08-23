import { IntoriFrameInputType } from './intoriFrameForms'

// A frame can only have up to four buttons.
// Therefore, if a frame needs more than 4 buttons we need to paginate and support
// a 'back' and 'more' button

export const determineAllInputOffsets = (
  inputStrings: string[]
): number[] => {
  const answerOffsets: number[] = [0]

  if (inputStrings.length <= 3) {
    return answerOffsets
  }

  answerOffsets.push(3)

  // for next pages, will always show '< back' [answer 1, answer 2] ('More >' or 'Skip')
  while (answerOffsets[answerOffsets.length - 1] + 2 < inputStrings.length) {
    answerOffsets.push(
      answerOffsets[answerOffsets.length - 1] + 2
    )
  }

  return answerOffsets
}

export const getNextInputOffset = (
  inputs: string[],
  currentOffset: number
): number => {
  const allInputOffsets = determineAllInputOffsets(inputs)
  const currentOffsetIndex = allInputOffsets.indexOf(currentOffset)

  return allInputOffsets[currentOffsetIndex + 1]
}

export const getBackInputOffset = (
  inputs: string[],
  currentOffset: number
): number => {
  const allInputOffsets = determineAllInputOffsets(inputs)
  const currentOffsetIndex = allInputOffsets.indexOf(currentOffset)

  return allInputOffsets[currentOffsetIndex - 1]
}

export const paginateInputs = (params: {
  inputs: IntoriFrameInputType[],
  currentInputOffset: number,
  moreButtonInput: (nextInputOffset: number) => IntoriFrameInputType,
  backButtonInput: (previousInputOffset: number) => IntoriFrameInputType,
}) => {
  const {
    inputs,
    currentInputOffset,
    moreButtonInput,
    backButtonInput
  } = params

  const inputContents = inputs.map(input => input.content)
  const nextInputOffset = getNextInputOffset(inputContents, currentInputOffset)
  const previousInputOffset = getBackInputOffset(inputContents, currentInputOffset)

  if (!currentInputOffset) {
    if (inputs.length <= 4) {
      return inputs
    }

    const firstThreeInputs = inputs.slice(0, 3)

    return [
      ...firstThreeInputs,
      moreButtonInput(getNextInputOffset(inputContents, 0))
    ]
  }

  const isLastGroupOfInputs = currentInputOffset + 3 >= inputs.length

  if (!isLastGroupOfInputs) {
    const nextTwoInputs = inputs.slice(currentInputOffset, currentInputOffset + 2)
    return [
      backButtonInput(previousInputOffset),
      ...nextTwoInputs,
      moreButtonInput(nextInputOffset)
    ]
  }

  const lastInputs = inputs.slice(currentInputOffset)

  return [
    backButtonInput(previousInputOffset),
    ...lastInputs
  ]
}
