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
    const files = await fs.readdir(folderPath);
    console.log(`Contents of ${folderPath}:`);
    files.forEach(file => {
      console.log(file);
    });
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

  const exists = await checkFileExists(pathToFont)
  console.log('cwd:', process.cwd())
  console.log(fileName, { exists })

  await listFolderContents(process.cwd())
  await listFolderContents(path.join(process.cwd(), 'public/assets/fonts/'))

  // check if file exists with path

  return await Jimp.loadFont(pathToFont)
}
