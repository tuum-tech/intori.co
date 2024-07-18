import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  loadKumbSans32,
  loadKumbSans26medium,
  loadKumbSans18,
  loadKumbSans14
} from '../../../utils/frames/fonts'
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

// Note: This is used to create a circle masked image
//
async function createCircularImage(url: string, baseImage: Jimp): Promise<void> {
  try {
    const urlImage = await Jimp.read(url);

    const maskImage = await Jimp.read(
      path.join(process.cwd(), 'public/frame_template_mask.png')
    );

    const circleImageSize = 183;

    // Resize the mask to the desired circle size
    maskImage.resize(circleImageSize, circleImageSize);

    // Calculate the scale to fill the circle mask without stretching
    const scale = Math.max(circleImageSize / urlImage.bitmap.width, circleImageSize / urlImage.bitmap.height);

    // Resize the image proportionally
    urlImage.scale(scale);

    // Calculate the dimensions to crop the image to fit the circle mask
    const x = (urlImage.bitmap.width - circleImageSize) / 2;
    const y = (urlImage.bitmap.height - circleImageSize) / 2;

    // Crop the image to ensure it covers the circle mask completely
    urlImage.crop(x, y, circleImageSize, circleImageSize);

    // Apply the mask to the cropped image
    urlImage.mask(maskImage, 0, 0);

    // Composite the result onto the base image
    baseImage.composite(urlImage, 201, 49);
  } catch (error) {
    console.error('Error creating circular image:', error)
    throw error
  }
}

async function addPowerBadge(baseImage: Jimp): Promise<void> {
  const powerBadge = await Jimp.read(
    path.join(process.cwd(), 'public/assets/templates/powerbadge.png')
  )

  baseImage.composite(powerBadge, 702, 99, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacitySource: 1,
    opacityDest: 1
  })
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
  const font18 = await loadKumbSans18()
  const font26medium = await loadKumbSans26medium()
  const font32 = await loadKumbSans32()

  // username
  baseImage.print(
    font18,
    444,
    49,
    {
      text: `@${userSuggestion.user.username}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    295,
    37
  )

  const avatar = userSuggestion.user.image ?? path.join(process.cwd(), 'public/assets/templates/avatar_fallback.png')

  // avatar
  await createCircularImage(
    avatar,
    baseImage
  )

  // total responses
  baseImage.print(
    font18,
    230,
    277,
    {
      text: `${totalResponses} Response${totalResponses === 1 ? '' : 's'}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    216,
    28
  )

  // last cast
  baseImage.print(
    font18,
    484,
    277,
    {
      text: lastCastTimeAgo,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    262,
    28
  )

  // bio
  baseImage.print(
    font18,
    202,
    317,
    {
      text: (
        userSuggestion.user.bio
          ? removeEmojis(replaceNewlinesWithSpaces(userSuggestion.user.bio))
          : 'No bio'
      ),
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    },
    537,
    128
  )

  // first reason
  baseImage.print(
    font26medium,
    221,
    466,
    {
      text: userSuggestion.reason[0],
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    522,
    148
  )

  // +N other responses
  if (userSuggestion.reason.length > 1) {
    baseImage.print(
      font18,
      230,
      643,
      {
        text: `+${userSuggestion.reason.length - 1} other answer${userSuggestion.reason.length === 2 ? '' : 's'} in common!`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      159,
      25
    )
  }

  // name
  baseImage.print(
    font32,
    385,
    90,
    {
      text: (userSuggestion.user.displayName
        ? removeEmojis(userSuggestion.user.displayName)
        : userSuggestion.user.username
      ),
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    308,
    40
  )

  // fid
  baseImage.print(
    font14,
    385,
    134,
    {
      text: `FID ${userSuggestion.user.fid}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    308,
    17
  )

  // power badge next to name
  if (userSuggestion.user.powerBadge) {
    await addPowerBadge(baseImage)
  }

  const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG)

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
