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
    question: "What is your favorite type of cuisine?",
    answers: ["Italian", "Mexican", "Chinese", "Indian", "Japanese", "French", "Thai", "Greek", "Spanish", "Korean"]
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
    question: 'Which of the following is your favorite season?',
    answers: [ 'Spring', 'Summer', 'Fall', 'Winter']
  },
  {
    question: "What is your favorite Go-to comfort food?",
    answers: ["Pizza", "Ice Cream", "Chocolate", "Soup", "Burgers", "Pasta"]
  },
  {
    question: "How do you prefer your coffee?",
    answers: ["Black", "Sugar", "Cream", "Sugar / Cream", "Decaf", "Flavored"]
  },
  {
    question: "What type of milk do you prefer?",
    answers: ["Whole", "2%", "Skim", "Soy", "Almond", "Oat"]
  },
  {
    question: "Which meal of the day is your favorite?",
    answers: ["Breakfast", "Brunch", "Lunch", "Tea Time", "Dinner", "Late Snack"]
  },
  {
    question: "What's your go-to snack type?",
    answers: ["Sweet", "Salty", "Healthy", "Indulgent", "Spicy", "Savory"]
  },
  {
    question: "How do you like your eggs cooked?",
    answers: ["Scrambled", "Fried", "Poached", "Boiled", "Omelette", "Whites Only"]
  },
  {
    question: "Which type of bread do you prefer?",
    answers: ["White", "Wheat", "Rye", "Sourdough", "Gluten-free", "Multigrain"]
  },
  {
    question: "What's your favorite type of cheese?",
    answers: ["Cheddar", "Mozzarella", "Swiss", "Blue", "Goat", "Vegan"]
  },
  {
    question: "How often do you eat out at restaurants?",
    answers: ["Daily", "Often", "Weekly", "Occasionally", "Rarely", "Never"]
  },
  {
    question: "What's your preferred style of pizza?",
    answers: ["New York", "Chicago", "Neapolitan", "Sicilian", "Gluten-free", "Vegan"]
  },
  {
    question: "How often do you cook at home?",
    answers: ["Daily", "Often", "Weekly", "Monthly", "Rarely", "Never", "Holidays"]
  },
  {
    question: "Do you have any dietary restrictions?",
    answers: ["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut-free", "Other", "None"]
  },
  {
    question: "What type of drink do you prefer?",
    answers: ["Coffee", "Tea", "Soft Drink", "Alcohol", "Smoothie", "Juice", "Water"]
  },
  {
    question: "What ingredient do you prefer when cooking?",
    answers: ["Salt", "Pepper", "Garlic", "Olive Oil", "Butter", "Onion"]
  },
  {
    question: "What dessert do you enjoy most?",
    answers: ["Cake", "Ice Cream", "Pie", "Cheesecake", "Tiramisu", "Brownies", "Fruit Tart"]
  },
  {
    question: "How many hours of sleep do you get on average per night?",
    answers: ["Under 5", "5-6", "7-8", "9-10", "Over 10", "Varies"]
  },
  {
    question: "What's your approach to nutrition?",
    answers: ["Strict Diet", "Balanced", "Count Cals", "Intuitive", "Vegetarian", "Vegan"]
  },
  {
    question: "How do you manage stress?",
    answers: ["Meditation", "Exercise", "Reading", "Socialize", "Music", "Crafts"]
  },
  {
    question: "Do you follow any specific wellness trends?",
    answers: ["Keto", "Paleo", "Fasting", "Plant-based", "Clean Eats", "None"]
  },
  {
    question: "How often do you take breaks during your workday?",
    answers: ["Hourly", "Often", "Only Lunch", "Rarely", "Never", "No Schedule"]
  },
  {
    question: "What type of wellness products do you use regularly?",
    answers: ["Supplements", "Essential Oils", "Herbal Teas", "Fitness Trackers", "Other", "None"]
  },
  {
    question: "How do you prefer to relax after a long day?",
    answers: ["Watch TV", "Reading", "A Walk", "A Bath", "Yoga", "Podcasts"]
  },
  {
    question: "What is your primary method for staying hydrated?",
    answers: ["Water", "Flavored Water", "Herbal Tea", "Sports Drink", "Juice", "Coffee/Tea"]
  },
  {
    question: "How often do you engage in outdoor activities?",
    answers: ["Daily", "Often", "Weekly", "Occasionally", "Rarely", "Never"]
  },
  {
    question: "How often do you practice mindfulness or meditation?",
    answers: ["Daily", "Weekly", "Monthly", "Occasionally", "Rarely", "Never"]
  },
  {
    question: "What is your common method of commuting?",
    answers: ["Walking", "Cycling", "Public Transport", "Car", "Carpool", "Stay Home"]
  },
  {
    question: "How do you prioritize your mental health?",
    answers: ["Therapy", "Journaling", "Meditation", "Socializing", "Self-Help", "None"]
  },
  {
    question: "How do you track your fitness progress?",
    answers: ["App", "Wearable", "Journal", "Equipment", "Trainer", "Multiple", "Don't Track"]
  }
]

export const isInitialQuestion = (question: string): boolean => {
  const questionIndex = intoriQuestions.findIndex(q => q.question === question)

  return questionIndex < 3
}
