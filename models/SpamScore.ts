import { prisma } from "@/prisma"

export const getSpamScoreForFid = async (fid: number) => {
  return prisma.spamScore.findFirst({
    where: { fid },
    select: { score: true, preventClaiming: true, banned: true, whitelist: true }
  })
}
