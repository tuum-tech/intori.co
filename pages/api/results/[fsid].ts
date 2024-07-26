import type { NextApiRequest, NextApiResponse } from 'next'
import Jimp from 'jimp'
import * as path from 'path'
import {
  loadFont
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
async function createAvatar(url: string, baseImage: Jimp): Promise<void> {
  try {
    const urlImage = await Jimp.read(url);

    const maskImage = await Jimp.read(
      path.join(process.cwd(), 'public/frame_template_mask.png')
    );

    const circleImageSize = 192;

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
    baseImage.composite(urlImage, 93, 119);
  } catch (error) {
    console.error('Error creating circular image:', error)
    throw error
  }
}

async function addPowerBadge(baseImage: Jimp): Promise<void> {
  const powerBadge = await Jimp.read(
    path.join(process.cwd(), 'public/assets/templates/powerbadge.png')
  )

  baseImage.composite(powerBadge, 238, 119, {
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

  const font18black = await loadFont({
    family: 'kumbh_sans',
    weight: 'regular',
    size: 18,
    color: 'black'
  })

  const font21black = await loadFont({
    family: 'kumbh_sans',
    weight: 'regular',
    size: 21,
    color: 'black'
  })

  const font24grey = await loadFont({
    family: 'kumbh_sans',
    weight: 'regular',
    size: 24,
    color: 'grey'
  })

  const font32black = await loadFont({
    family: 'kumbh_sans',
    weight: 'bold',
    size: 32,
    color: 'black'
  })

  const font28white = await loadFont({
    family: 'kumbh_sans',
    weight: 'semibold',
    size: 28,
    color: 'white'
  })

  // display name
  baseImage.print(
    font32black,
    318,
    162,
    {
      text: (userSuggestion.user.displayName
        ? removeEmojis(userSuggestion.user.displayName)
        : userSuggestion.user.username
      ),
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    356,
    26
  )

  // username
  baseImage.print(
    font24grey,
    318,
    198,
    {
      text: `@${userSuggestion.user.username}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    356,
    26
  )

  // fid
  baseImage.print(
    font18black,
    318,
    234,
    {
      text: `FID ${userSuggestion.user.fid}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    356,
    26
  )

  const avatar = userSuggestion.user.image ?? path.join(process.cwd(), 'public/assets/templates/avatar_fallback.png')

  // avatar
  await createAvatar(
    avatar,
    baseImage
  )

  // power badge on avatar
  if (userSuggestion.user.powerBadge) {
    await addPowerBadge(baseImage)
  }

  // total responses
  baseImage.print(
    font18black,
    119,
    62,
    {
      text: `${totalResponses} Response${totalResponses === 1 ? '' : 's'}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    118,
    26
  )

  // last cast
  baseImage.print(
    font18black,
    415,
    62,
    {
      text: lastCastTimeAgo,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    217,
    26
  )

  // bio
  baseImage.print(
    font21black,
    107,
    336,
    {
      text: (
        userSuggestion.user.bio
          ? removeEmojis(replaceNewlinesWithSpaces(userSuggestion.user.bio))
          : 'No bio'
      ),
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    },
    552,
    100
  )

  // first reason
  baseImage.print(
    font28white,
    104,
    455,
    {
      text: userSuggestion.reason[0],
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    557,
    159
  )

  // +N other responses
  if (userSuggestion.reason.length > 1) {
    baseImage.print(
      font18black,
      107,
      630,
      {
        text: `+ ${userSuggestion.reason.length - 1} other answer${userSuggestion.reason.length === 2 ? '' : 's'} in common!`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      356,
      26
    )
  }

  const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG)

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(buffer)
}

export default getProfileFramePictureImage
