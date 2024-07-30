import * as path from 'path'
import { registerFont, loadImage, CanvasRenderingContext2D } from 'canvas'

const FONT_PATH = path.join(process.cwd(), 'public/assets/fonts/src/')

// emojis
registerFont(
  path.join(FONT_PATH, 'NotoColorEmoji-Regular.ttf'),
  { family: 'Noto Color Emoji' }
)
registerFont(
  path.join(FONT_PATH, 'KumbhSans-Regular.ttf'),
  { family: 'kumbh_sans', weight: '400' }
)
registerFont(
  path.join(FONT_PATH, 'KumbhSans-SemiBold.ttf'),
  { family: 'kumbh_sans', weight: '600' }
)
registerFont(
  path.join(FONT_PATH, 'KumbhSans-Bold.ttf'),
  { family: 'kumbh_sans', weight: '700' }
)
registerFont(
  path.join(FONT_PATH, 'KumbhSans-Black.ttf'),
  { family: 'kumbh_sans', weight: '900' }
)
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

// Function to draw text with line wrapping, centered and bottom alignment, and emoji support
export function drawText (
  ctx: CanvasRenderingContext2D,
  options: {
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    fontSize: string
    color: string
  }
): void {
  const { text, maxWidth, x, lineHeight, fontSize, color } = options
  let { y } = options

  const lines = wrapText(ctx, text, maxWidth)
  const totalHeight = lines.length * lineHeight

  y -= totalHeight // Adjust y position for bottom alignment

  lines.forEach(line => {
    let lineX = x
    const lineWidth = ctx.measureText(line).width

    lineX -= lineWidth / 2 // Adjust x position for center alignment

    for (const char of line) {
      const emojiRegex = RegExp(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}\u{1F192}\u{1F193}\u{1F194}\u{1F195}\u{1F196}\u{1F197}\u{1F198}\u{1F199}\u{1F19A}\u{1F201}\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}\u{1F233}\u{1F234}\u{1F235}\u{1F236}\u{1F237}\u{1F238}\u{1F239}\u{1F23A}\u{1F250}\u{1F251}]/u)

      if (emojiRegex.test(char)) {
        ctx.font = `${fontSize} "Noto Color Emoji"`
      } else {
        ctx.font = `${fontSize} "Open Sans"`
      }

      ctx.fillStyle = color
      ctx.fillText(char, lineX, y)
      lineX += ctx.measureText(char).width
    }
    y += lineHeight
  })
}

export const addImageToCanvas = async (
  ctx: CanvasRenderingContext2D,
  imagePath: string,
  position: {
    x: number,
    y: number
  }
): Promise<void> => {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, position.x, position.y);
}
