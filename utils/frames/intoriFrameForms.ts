export type IntoriFrameStepType = {
  title: string
  question?: string
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

export const introductionStep: IntoriFrameStepType = {
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
}

export const finalStep: IntoriFrameStepType = {
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

export const intoriFrameForms: Record<string, IntoriFrameFormType> = {
  initial: {
    name: 'Professional Experience',
    steps: [
      {
        title: 'Professional Experience',
        question: 'How would you describe your current professional status?',
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
        question: 'How would you describe your current professional status?',
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
        title: 'Skills & Endorsements',
        question: 'Which of the following skills best align with your expertise?',
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
        title: 'Skills & Endorsements',
        question: 'Which of the following skills best align with your expertise?',
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
      }
    ]
  },
  personalValues: {
      name: 'personalValues',
      steps: [
        {
            title: 'Personal Values & Goals',
            question: 'Which of the following values are most important to you in your professional life?',
            inputs: [
              {
                type: 'button',
                content: 'Life Balance'
              },
              {
                type: 'button',
                content: '$$ Stability'
              },
              {
                type: 'button',
                content: 'Growth'
              },
              {
                type: 'button',
                content: 'Next'
              },
            ]
        },
        {
            title: 'Personal Values & Goals',
            question: 'Which of the following values are most important to you in your professional life?',
            inputs: [
              {
                type: 'button',
                content: 'Positive Impact'
              },
              {
                type: 'button',
                content: 'Innovation'
              },
              {
                type: 'button',
                content: 'Collaboration'
              },
              {
                type: 'button',
                content: 'Other'
              },
            ]
        },
        {
            title: 'Education & Certifications',
            question: 'What is your highest level of education?',
            inputs: [
              {
                type: 'button',
                content: 'High School'
              },
              {
                type: 'button',
                content: 'Associate\'s'
              },
              {
                type: 'button',
                content: 'Bachelor\'s'
              },
              {
                type: 'button',
                content: 'Next'
              },
            ]
        },
        {
            title: 'Education & Certifications',
            question: 'What is your highest level of education?',
            inputs: [
              {
                type: 'button',
                content: 'Master\'s'
              },
              {
                type: 'button',
                content: 'Doctorate'
              },
              {
                type: 'button',
                content: 'Certification'
              },
              {
                type: 'button',
                content: 'Other'
              }
            ]
        }
      ]
  },
  lifeStyle: {
    name: 'lifeStyle',
    steps: [
      {
        title: 'Lifestyle & Wellness',
        question: 'Which of the following are your exercise preferences?',
        inputs: [
          {
            type: 'button',
            content: 'Gym'
          },
          {
            type: 'button',
            content: 'Running'
          },
          {
            type: 'button',
            content: 'Yoga'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Lifestyle & Wellness',
        question: 'Which of the following are your exercise preferences?',
        inputs: [
          {
            type: 'button',
            content: 'Sports'
          },
          {
            type: 'button',
            content: 'Home Workout'
          },
          {
            type: 'button',
            content: 'Outside'
          },
          {
            type: 'button',
            content: 'None'
          },
        ]
      },
      {
        title: 'Lifestyle & Wellness',
        question: 'What are your sleep habits?',
        inputs: [
          {
            type: 'button',
            content: 'Early Bird'
          },
          {
            type: 'button',
            content: 'Night Owl'
          },
          {
            type: 'button',
            content: 'Insomniac'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Lifestyle & Wellness',
        question: 'What are your sleep habits?',
        inputs: [
          {
            type: 'button',
            content: 'Heavy Sleep'
          },
          {
            type: 'button',
            content: 'Variable'
          },
          {
            type: 'button',
            content: 'Regular Naps'
          },
          {
            type: 'button',
            content: 'Other'
          }
        ]
      }
    ]
  },
  foodAndDrink: {
    name: 'foodAndDrink',
    steps: [
      {
        title: 'Food and Drink',
        question: 'Which of the following are your preferred type of cuisine?',
        inputs: [
          {
            type: 'button',
            content: 'Italian'
          },
          {
            type: 'button',
            content: 'Mexican'
          },
          {
            type: 'button',
            content: 'Chinese'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Food and Drink',
        question: 'Which of the following are your preferred type of cuisine?',
        inputs: [
          {
            type: 'button',
            content: '< Back'
          },
          {
            type: 'button',
            content: 'Indian'
          },
          {
            type: 'button',
            content: 'Japanese'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Food and Drink',
        question: 'Which of the following are your preferred type of cuisine?',
        inputs: [
          {
            type: 'button',
            content: '< Back'
          },
          {
            type: 'button',
            content: 'French'
          },
          {
            type: 'button',
            content: 'American'
          },
          {
            type: 'button',
            content: 'Other'
          },
        ]
      },
      {
        title: 'Food and Drink',
        question: 'Which of the following are your favorite type of snack?',
        inputs: [
          {
            type: 'button',
            content: '< Back'
          },
          {
            type: 'button',
            content: 'Sweet'
          },
          {
            type: 'button',
            content: 'Salty'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Food and Drink',
        question: 'Which of the following are your favorite type of snack?',
        inputs: [
          {
            type: 'button',
            content: '< Back'
          },
          {
            type: 'button',
            content: 'Healthy'
          },
          {
            type: 'button',
            content: 'Indulgent'
          },
          {
            type: 'button',
            content: 'More'
          },
        ]
      },
      {
        title: 'Food and Drink',
        question: 'Which of the following are your favorite type of snack?',
        inputs: [
          {
            type: 'button',
            content: '< Back'
          },
          {
            type: 'button',
            content: 'Spicy'
          },
          {
            type: 'button',
            content: 'Savory'
          },
          {
            type: 'button',
            content: 'None'
          },
        ]
      },
    ]
  }
}
