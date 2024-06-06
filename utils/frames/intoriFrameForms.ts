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
        postUrl: `${process.env.NEXTAUTH_URL}/frames/question`
      }
    ]
}

export const errorFrame: IntoriFrameType = {
    inputs: [
      {
        type: 'button',
        content: 'Try Again'
      }
    ]
}

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
        target: process.env.NEXTAUTH_URL + '/frames/sequence/',
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
    question: 'Which of the following is your music preference?',
    answers: [ 'Pop', 'Rock', 'Classical', 'Jazz', 'Electronic', 'Hip-Hop', 'Country']
  },
  {
    question: 'Which of the following is your favorite movie genre?',
    answers: [ 'Action', 'Romance', 'Comedy', 'Horror', 'Fantasy', 'Documentaries', 'Sci-Fi']
  },
  {
    question: 'Which of the following are your favorite type of snack?',
    answers: [ 'Sweet', 'Salty', 'Healthy', 'Indulgent', 'Spicy', 'Savory', 'None']
  }
]
