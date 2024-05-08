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

  const pathToPng = path.join(
    process.cwd(),
    'public/assets/frames/kumbh_sans_32.png'
  )

  const fntExists = path.resolve(pathToFont)
  const pngExists = path.resolve(pathToPng)

  console.log({
    fntExists,
    pngExists
  })

  return await Jimp.loadFont(pathToFont)
}

export const loadKumbSans21 = async () => {
  const pathToFont = path.join(
    process.cwd(),
    'public/assets/frames/kumbh_sans_21.fnt'
  )
  console.log('resulting path for 21 :', pathToFont)
  return await Jimp.loadFont(pathToFont)
}
