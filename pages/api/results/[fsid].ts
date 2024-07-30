import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import * as path from 'path'
import { getLastCastForUser } from '../../../utils/neynarApi'
import { countTotalResponsesForUser } from '../../../models/userAnswers'
import { getFrameSessionFromRequest } from '../../../models/frameSession'
import {
  createFrameErrorUrl
} from '../../../utils/frames/generatePageUrls'
import {
  timeAgo,
  replaceNewlinesWithSpaces,
  removeEmojis
} from '../../../utils/textHelpers'
import { drawText, addImageToCanvas } from '../../../utils/canvasHelpers'

// Note: This is used to create a circle masked image
//
async function createAvatar(
  ctx: CanvasRenderingContext2D,
  url: string,
  position: {
    x: number,
    y: number
  }
): Promise<void> {
  try {
    const circleSize = 192;
    const image = await loadImage(url);

    // Create an off-screen canvas to perform the masking and scaling
    const offscreenCanvas = createCanvas(circleSize, circleSize);
    const offscreenCtx = offscreenCanvas.getContext('2d');

    // Calculate the scale to fill the circle without stretching
    const scale = Math.max(circleSize / image.width, circleSize / image.height);

    // Resize the image proportionally
    const width = image.width * scale;
    const height = image.height * scale;

    // Calculate the dimensions to crop the image to fit the circle
    const offsetX = (width - circleSize) / 2;
    const offsetY = (height - circleSize) / 2;

    // Draw the image on the off-screen canvas
    offscreenCtx.drawImage(image, -offsetX, -offsetY, width, height);

    // Create a circular clipping path
    offscreenCtx.globalCompositeOperation = 'destination-in';
    offscreenCtx.beginPath();
    offscreenCtx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2);
    offscreenCtx.closePath();
    offscreenCtx.fill();

    // Draw the resulting circular image on the main canvas
    ctx.drawImage(offscreenCanvas, position.x, position.y, circleSize, circleSize);
  } catch (error) {
    console.error('Error creating circular image:', error)
    throw error
  }
}

const getProfileFramePictureImage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const baseImage = await loadImage(
      path.join(process.cwd(), 'public/assets/templates/results_frame_template.png')
  )
  const canvas = createCanvas(baseImage.width, baseImage.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(baseImage, 0, 0)

  const session = await getFrameSessionFromRequest(req)

  if (!session) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const suggestionsRevealed = parseInt(req.query.i?.toString() ?? '0', 10)
  const userSuggestion = session.suggestions[suggestionsRevealed % session.suggestions.length]

  if (!userSuggestion.user?.fid) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const suggestedUserFid = userSuggestion.user.fid
  const totalResponses = await countTotalResponsesForUser(suggestedUserFid)
  const lastCast = await getLastCastForUser(suggestedUserFid)
  const lastCastTimeAgo = lastCast ? `Last cast ${timeAgo(lastCast.timestamp)}` : 'Never casted'

  const BLACK = '#0B0B15'
  const WHITE = '#FFFFFF'
  const GREY = '#393939'

  // display name
  drawText(
    ctx,
    {
      text: (userSuggestion.user.displayName
          ? removeEmojis(userSuggestion.user.displayName)
          : userSuggestion.user.username
      ),
      x: 318,
      y: 122,
      maxWidth: 356,
      lineHeight: 38,
      fontSize: '32px',
      color: BLACK
    }
  )

  // username
  drawText(
    ctx,
    {
      text: `@${userSuggestion.user.username}`,
      x: 318,
      y: 208,
      maxWidth: 356,
      lineHeight: 26,
      fontSize: '24px',
      color: GREY
    }
  )

  // fid
  drawText(
    ctx,
    {
      text: `FID ${userSuggestion.user.fid}`,
      x: 318,
      y: 244,
      maxWidth: 356,
      lineHeight: 18,
      fontSize: '18px',
      color: BLACK
    }
  )

  const avatar = (
    userSuggestion.user.image ??
    path.join(process.cwd(), 'public/assets/templates/avatar_fallback.png')
  )

  // avatar
  await createAvatar(
    ctx,
    avatar,
    {
      x: 93,
      y: 119
    }
  )

  // power badge on avatar
  if (userSuggestion.user.powerBadge) {
    const powerBadgeImagePath = path.join(
      process.cwd(), 
      'public/assets/templates/powerbadge.png'
    )

    await addImageToCanvas(
      ctx,
      powerBadgeImagePath,
      {
        x: 238,
        y: 119
      }
    )
  }

  // total responses
  drawText(
    ctx,
    {
      text: `${totalResponses} Response${totalResponses === 1 ? '' : 's'}`,
      x: 119,
      y: 62,
      maxWidth: 118,
      lineHeight: 18,
      fontSize: '18px',
      color: BLACK
    }
  )

  // last cast
  drawText(
    ctx,
    {
      text: lastCastTimeAgo,
      x: 415,
      y: 62,
      maxWidth: 217,
      lineHeight: 18,
      fontSize: '18px',
      color: BLACK
    }
  )

  // bio
  drawText(
    ctx,
    {
      text: replaceNewlinesWithSpaces(userSuggestion.user.bio || 'No bio'),
      x: 107,
      y: 336,
      maxWidth: 552,
      lineHeight: 26,
      fontSize: '21px',
      color: BLACK
    }
  )

  // first reason
  drawText(
    ctx,
    {
      text: userSuggestion.reason[0],
      x: 104,
      y: 455,
      maxWidth: 557,
      lineHeight: 35,
      fontSize: '28px',
      color: WHITE
    }
  )

  // +N other responses
  if (userSuggestion.reason.length > 1) {
    drawText(
      ctx,
      {
        text: `+ ${userSuggestion.reason.length - 1} other answer${userSuggestion.reason.length === 2 ? '' : 's'} in common!`,
        x: 107,
        y: 630,
        maxWidth: 356,
        lineHeight: 18,
        fontSize: '18px',
        color: BLACK
      }
    )
  }

  const buffer = canvas.toBuffer('image/png')

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
