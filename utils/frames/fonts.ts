import * as path from 'path'
import Jimp from 'jimp'

export const loadKumbSans32 = async () => {

  const pathToFont = path.join(
    process.cwd(),
    'public/assets/frames/kumbh_sans_32.fnt'
  )

  const pathToPng = path.join(
    process.cwd(),
    'public/assets/frames/kumbh_sans_32.png'
  )

  const fntExists = path.resolve(pathToFont)
  const pngExists = path.resolve(pathToPng)

  return await Jimp.loadFont(pathToFont)
}

export const loadKumbSans21 = async () => {
  const pathToFont = path.join(
    process.cwd(),
    'public/assets/frames/kumbh_sans_21.fnt'
  )
  return await Jimp.loadFont(pathToFont)
}
