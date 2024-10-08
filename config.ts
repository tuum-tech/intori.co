import dotenv from 'dotenv-safe'

const config = () => {
  dotenv.config({
    path: './.env.local',
    example: './.env.example',
  })
}

export default config
