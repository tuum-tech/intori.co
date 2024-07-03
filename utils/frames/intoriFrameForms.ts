import { createStartNewFrameQuestionUrl } from './generatePageUrls'
export type IntoriFrameInputType = {
    type: 'button'
    content: string
    action?: 'link'
    target?: string
    postUrl?: string // A 256-byte string that defines a button-specific URL to send the Signature Packet to. If set, this overrides fc:frame:post_url.
}

export type IntoriFrameType = {
  question?: string
  inputs: IntoriFrameInputType[]
}

export const introductionStep: IntoriFrameType = {
    inputs: [
      {
        type: 'button',
        content: 'Learn More',
        action: 'link',
        target: 'https://www.intori.co/'
      },
      {
        type: 'button',
        content: 'Go!',
        postUrl: createStartNewFrameQuestionUrl()
      }
    ]
}

export const errorFrame: IntoriFrameType = {
    inputs: [
      {
        type: 'button',
        content: 'Try Again',
        postUrl: createStartNewFrameQuestionUrl()
      }
    ]
}

const urlSafeText = encodeURIComponent('Check out this frame from Intori!')
const shareFrameUrlSafeText = encodeURIComponent(process.env.NEXTAUTH_URL + '/frames/begin')
const shareFrameUrl = `https://warpcast.com/~/compose?text=${urlSafeText}&embeds[]=${shareFrameUrlSafeText}`

export const finalStep: IntoriFrameType = {
    inputs: [
      {
        type: 'button',
        content: 'Suggested Follows'
      },
      {
        type: 'button',
        content: 'Suggested Channel'
      },
      {
        type: 'button',
        action: 'link',
        target: shareFrameUrl,
        content: 'Share Frame'
      },
      {
        type: 'button',
        action: 'link',
        target: 'https://www.intori.co/',
        content: 'View intori.co'
      },
    ]
}

export const intoriQuestions = [
  {
    question: 'Which of the following is your favorite season?',
    answers: [ 'Spring', 'Summer', 'Fall', 'Winter']
  },
  {
    question: 'Which of the following is your music preference?',
    answers: [ 'Pop', 'Rock', 'Latin', 'Classical', 'Jazz', 'Electronic', 'Hip-Hop', 'Country']
  },
  {
    question: 'Which of the following is your favorite movie genre?',
    answers: [ 'Action', 'Drama', 'Romance', 'Comedy', 'Horror', 'Animation', 'Sci-Fi']
  },
  {
    question: 'Which of the following is your favorite type of snack?',
    answers: [ 'Sweet', 'Salty', 'Healthy', 'Indulgent', 'Spicy', 'Savory', 'None']
  },
  {
    question: "Which of the following values are most important to you in your professional life?",
    answers: ["Life Balance", "$ Stability", "Growth", "Impact", "Innovation", "Collaboration", "Other"]
  },
  {
    question: "What is your highest level of education?",
    answers: ["High School", "Associate's", "Bachelor's", "Master's", "Doctorate", "Cert.", "Other"]
  },
  {
    question: "Which of the following are your exercise preferences?",
    answers: ["Gym", "Running", "Yoga", "Sports", "Home Workout", "Outside", "None"]
  },
  {
    question: "What are your sleep habits?",
    answers: ["Early Bird", "Night Owl", "Insomniac", "Heavy Sleep", "Variable", "Regular Naps", "Other"]
  },
  {
    question: "Which of the following is your preferred operating system?",
    answers: ["Windows", "macOS", "Linux", "Android", "iOS", "Chrome OS", "Other"]
  },
  {
    question: "Which of the following is your dream vacation destination?",
    answers: ["Tropics", "Historic", "Wilderness", "Cultural Tour", "Space", "Road Trip", "Other"]
  },
  {
    question: "Which of the following is your preferred mode of travel?",
    answers: ["Plane", "Train", "Car", "Cruise", "Biking", "Walking", "Other"]
  },
  {
    question: "Which of the following is your level of environmental consciousness?",
    answers: ["Concerned", "Moderately", "Slightly", "Neutral", "Unconcerned", "Activist", "Other"]
  },
  {
    question: "Which of the following is your importance of work-life balance?",
    answers: ["Essential", "Very", "Moderately", "Slightly", "Not Important", "Flexible", "Other"]
  },
  {
    question: "What is your favorite type of cuisine?",
    answers: ["Italian", "Mexican", "Chinese", "Indian", "Japanese", "French", "Thai", "Greek", "Spanish", "Korean"]
  }
]
export const isInitialQuestion = (question: string): boolean => {
  const questionIndex = intoriQuestions.findIndex(q => q.question === question)

  return questionIndex < 3
}
