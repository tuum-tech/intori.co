export type IntoriFrameStepType = {
  title: string
  inputs: {
    type: 'button'
    content: string
    action?: 'link'
    target?: string
  }[]
}

export type IntoriFrameFormType = {
  name: string
  steps: IntoriFrameStepType[]
}

export const intoriFrameForms: Record<string, IntoriFrameFormType> = {
  initial: {
    name: 'initial',
    steps: [
      {
        title: 'Intori',
        inputs: [
          {
            type: 'button',
            content: 'Go!'
          },
          {
            type: 'button',
            content: 'Learn More',
            action: 'link',
            target: 'https://www.intori.co/'
          }
        ]
      },
      {
        title: 'Professional Experience',
        inputs: [
          {
            type: 'button',
            content: 'Employed'
          },
          {
            type: 'button',
            content: 'Self-employed'
          },
          {
            type: 'button',
            content: 'Freelancer'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Professional Experience',
        inputs: [
          {
            type: 'button',
            content: 'Student'
          },
          {
            type: 'button',
            content: 'Retired'
          },
          {
            type: 'button',
            content: 'Job Seeking'
          },
          {
            type: 'button',
            content: 'Other'
          },
        ]
      },
      {
        title: 'Skills and Endorsements',
        inputs: [
          {
            type: 'button',
            content: 'Programming'
          },
          {
            type: 'button',
            content: 'Design'
          },
          {
            type: 'button',
            content: 'Management'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Skills and Endorsements',
        inputs: [
          {
            type: 'button',
            content: 'Sales'
          },
          {
            type: 'button',
            content: 'Marketing'
          },
          {
            type: 'button',
            content: 'Education'
          },
          {
            type: 'button',
            content: 'Other'
          },
        ]
      },
      {
        title: 'Congrats – your profile is growing!',
        inputs: [
          {
            type: 'button',
            content: 'View Profile'
          },
          {
            type: 'button',
            content: 'Share'
          }
        ]
      }
    ]
  }
}
