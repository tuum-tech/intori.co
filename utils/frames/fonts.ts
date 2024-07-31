import * as path from 'path'
import { promises as fs } from 'fs'
import Jimp from 'jimp'

const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

const listFolderContents = async (folderPath: string): Promise<void> => {
  try {
    await fs.readdir(folderPath);
  } catch (error) {
    console.error(`Error reading directory ${folderPath}:`, error);
  }
};

export const loadFont = async (params: {
  family: 'kumbh_sans'
  weight: 'regular' | 'medium' | 'light' | 'semibold' | 'bold'
  size: number
  color: 'white' | 'black' | 'grey'
}) => {
  const fileName = `${params.family}_${params.size}_${params.weight}_${params.color}.fnt`

  const pathToFont = path.join(
    process.cwd(),
    'public/assets/fonts/',
    fileName
  )

  // for some reason, this helps vercel to find the font file
  await checkFileExists(pathToFont)
  await listFolderContents(process.cwd())
  await listFolderContents(path.join(process.cwd(), 'public/assets/fonts/'))

  // check if file exists with path

  return await Jimp.loadFont(pathToFont)
}
