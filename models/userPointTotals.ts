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

  const total = pointRecordsSinceLastClaim.reduce((acc, record) => acc + BigInt(record.points), BigInt(0))

  if (total < BigInt(0)) {
    return "0"
  }

  return total.toString()
}
