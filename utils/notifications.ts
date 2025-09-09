import {
  SendNotificationRequest,
  sendNotificationResponseSchema,
} from "@farcaster/frame-sdk"

import { getSpamScoreForFid } from "@/models/SpamScore"
import { prisma } from "@/prisma"

const host = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

type SendFrameNotificationResult =
  | {
      state: "error"
      error: unknown
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" }

export async function sendFrameNotification({
  fid,
  title,
  body,
  targetPath, // e.g. /my-gifts?giftId=123
  targetUrl   // e.g. https://example.com/my-gifts?giftId=123
}: {
  fid: number
  title: string
  body: string
  targetPath?: string
  targetUrl?: string
}): Promise<SendFrameNotificationResult> {
  const notificationDetails = await prisma.userNotificationDetails.findFirst({
    where: { fid }
  })

  if (!notificationDetails) {
    return { state: "no_token" }
  }

  const spamScore = await getSpamScoreForFid(fid)

  if (
    !spamScore ||
    (!spamScore.whitelist  && (
      spamScore.banned ||
      spamScore.preventClaiming ||
      spamScore.score < 0.5
    ))
  ) {
    return { state: "error", error: "User score too low and is not whitelisted." }
  }

  const response = await fetch(notificationDetails.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: (targetUrl ?? host) + (targetPath || "").trim(),
      tokens: [notificationDetails.token],
    } satisfies SendNotificationRequest),
  })

  const responseJson = await response.json()

  if (response.status === 200) {
    const responseBody = sendNotificationResponseSchema.safeParse(responseJson)

    if (responseBody.success === false) {
      return { state: "error", error: responseBody.error.errors }
    }

    if (responseBody.data.result.rateLimitedTokens.length) {
      return { state: "rate_limit" }
    }

    return { state: "success" }
  }

  return { state: "error", error: responseJson }
}
