import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  loadKumbSans32,
  loadKumbSans24,
  loadKumbSans14
} from '../../../utils/frames/fonts'
import { getLastCastForUser } from '../../../utils/neynarApi'
import { countTotalResponsesForUser } from '../../../models/userAnswers'
import { getFrameSessionFromRequest } from '../../../models/frameSession'
import {
  createFrameErrorUrl
} from '../../../utils/frames/generatePageUrls'
import { timeAgo } from '../../../utils/textHelpers'

// Note: This is used to create a circle masked image
//
async function createCircularImage(url: string, baseImage: Jimp): Promise<void> {
  try {
    const urlImage = await Jimp.read(url)

    const maskImage = await Jimp.read(
      path.join(process.cwd(), 'public/frame_template_mask.png')
    )

    const circleImageSize = 165

    maskImage.resize(circleImageSize, circleImageSize)
    urlImage.resize(circleImageSize, circleImageSize)

    urlImage.mask(maskImage, 0, 0)

    baseImage.composite(urlImage, 486, 126)
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

  const baseImage = await Jimp.read(
      path.join(process.cwd(), 'public/assets/templates/results_frame_template.png')
  )

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

  const font14 = await loadKumbSans14()
  const font24 = await loadKumbSans24()
  const font32 = await loadKumbSans32()

  // username
  baseImage.print(
    font14,
    425,
    76,
    {
      text: `@${userSuggestion.user.username}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    288,
    29
  )

  const avatar = userSuggestion.user.image ?? path.join(process.cwd(), 'public/assets/templates/avatar_fallback.png')

  // avatar
  await createCircularImage(
    avatar,
    baseImage
  )

  // total responses
  baseImage.print(
    font14,
    356,
    302,
    {
      text: `${totalResponses} Response${totalResponses === 1 ? '' : 's'}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    228,
    26
  )

  // last cast
  baseImage.print(
    font14,
    356,
    346,
    {
      text: lastCastTimeAgo,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    208,
    26
  )

  // bio
  baseImage.print(
    font14,
    356,
    374,
    {
      text: userSuggestion.user.bio || 'No bio',
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    416,
    57
  )

  // first reason
  baseImage.print(
    font24,
    318,
    463,
    {
      text: userSuggestion.reason[0],
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    454,
    150
  )

  // +N other responses
  if (userSuggestion.reason.length > 1) {
    baseImage.print(
      font14,
      314,
      623,
      {
        text: `+${userSuggestion.reason.length - 1} other answer${userSuggestion.reason.length === 2 ? '' : 's'} in common!`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      285,
      32
    )
  }

  // name
  baseImage.print(
    font32,
    187,
    658,
    {
      text: userSuggestion.user.displayName || userSuggestion.user.username,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    568,
    97
  )

  const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG)

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
