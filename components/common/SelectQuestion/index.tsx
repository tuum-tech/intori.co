import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Input from '../Input'
import { QuestionType } from '../../../models/questions'
import { createChannelQuestionFrameUrl } from '../../../utils/frames/generatePageUrls'
import { Select } from '../Select'

type Props = {
  channelId: string
  questions: QuestionType[]
}

export const SelectQuestion: React.FC<Props> = ({ channelId, questions }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('')

  const selectedQuestion = useMemo(() => {
    return questions.find((question) => question.id === selectedQuestionId)
  }, [selectedQuestionId, questions])

  const channelQuestionFrameUrl = useMemo(() => {
    if (!selectedQuestionId) {
      return ''
    }

    return createChannelQuestionFrameUrl({
      channelId,
      questionId: selectedQuestionId
    })
  }, [channelId, selectedQuestionId])

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(channelQuestionFrameUrl)
    toast.success('Frame link copied to clipboard 😎')
  }

  return (
    <>
      <Select
        name="selectedQuestionId"
        label="Create a single question frame"
        options={questions.map((question) => ({
          label: question.question,
          value: question.id
        }))}
        onChange={(e) => setSelectedQuestionId(e.target.value)}
        value={selectedQuestionId}
        placeholder="Select a question..."
      />

      { selectedQuestion && (
        <Input
          label="Question Frame URL"
          value={channelQuestionFrameUrl}
          note="Click to copy to clipboard"
          onClick={copyUrlToClipboard}
          readOnly
        />
      )}
    </>
  )
}

