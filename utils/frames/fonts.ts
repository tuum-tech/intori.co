import * as path from 'path'
import Jimp from 'jimp'

export const loadFont = async (fontName: string) => {
  const pathToFont = path.join(
    process.cwd(),
    'public/assets/fonts/',
    fontName
  )

  return await Jimp.loadFont(pathToFont)
}

export const loadKumbSans50 = async () => {
  return await loadFont('kumbh_sans_50.fnt')
}

export const loadKumbSans32 = async () => {
  return await loadFont('kumbh_sans_32.fnt')
}

export const loadKumbSans30 = async () => {
  return await loadFont('kumbh_sans_30.fnt')
}

export const loadKumbSans26 = async () => {
  return await loadFont('kumbh_sans_26.fnt')
}

export const loadKumbSans21 = async () => {
  return await loadFont('kumbh_sans_21.fnt')
}

export const loadKumbSans20 = async () => {
  return await loadFont('kumbh_sans_20.fnt')
}
