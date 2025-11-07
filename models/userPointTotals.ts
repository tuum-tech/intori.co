import { prisma } from "@/prisma"

export const getPointsTotalForFid = async (
  fid: number,
): Promise<string> => {
  const mostRecentClaimTransactionRecord = await prisma.claimTransactionRecord.findFirst({
    where: {
      fid
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const pointRecordsSinceLastClaim = await prisma.pointRecord.findMany({
    where: {
      AND: [
        { fid },
        {
          createdAt: {
            gt: mostRecentClaimTransactionRecord?.createdAt ?? new Date(0)
          }
        }
      ]
    }
  })

  return pointRecordsSinceLastClaim.toString()
}
