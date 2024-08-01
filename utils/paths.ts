import * as path from 'path'

export const inPublicFolder = (inPath: string): string => {
  return path.join(process.cwd(), `public`, inPath)
}
