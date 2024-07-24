import { readFileSync } from 'fs'
import * as path from 'path'
import questions from '../../public/questions/all.json'

export type IntoriQuestionType = {
  question: string
  answers: string[]
  categories: string[]
}

export const getAvailableQuestions = (params: {
  channelId?: string
} = {}): IntoriQuestionType[] => {
  if (!params.channelId) {
    return questions
  }

  try {
    const questionJsonPath = path.join(
      process.cwd(),
      'public/questions/channels',
      `${params.channelId}.json`
    )

    const contents = readFileSync(questionJsonPath, 'utf8')

    return JSON.parse(contents)
  } catch (err) {
    console.error('Failed to get questions by params:', params, err)
  }

  return []
}
