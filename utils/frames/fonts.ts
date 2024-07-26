import * as path from 'path'
import Jimp from 'jimp'

export const loadFont = async (params: {
  family: 'kumbh_sans'
  weight: 'regular' | 'medium' | 'light' | 'semibold'
  size: number
  color: 'white' | 'black' | 'grey'
}) => {
  const fileName = `${params.family}_${params.size}_${params.weight}_${params.color}.fnt`

  const pathToFont = path.join(
    process.cwd(),
    'public/assets/fonts/',
    fileName
  )

  return await Jimp.loadFont(pathToFont)
}
