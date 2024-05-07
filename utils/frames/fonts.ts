import * as path from 'path'
import Jimp from 'jimp'

export const loadKumbSans32 = async () => {
  console.log({
    cwd: process.cwd(),
    '__dirname': __dirname,
    '__filename': __filename
  })

  const pathToFont = path.join(
    process.cwd(),
    'public/assets/frames/kumbh_sans_32.fnt'
  )
  return await Jimp.loadFont(pathToFont)
}

export const loadKumbSans21 = async () => {
  const pathToFont = path.join(
    process.cwd(),
    'public/assets/frames/kumbh_sans_21.fnt'
  )
  return await Jimp.loadFont(pathToFont)
}
