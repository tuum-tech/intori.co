import { Prisma, UserAnswerTotal } from "@prisma/client"
import { prisma } from "@/prisma"

export const getPageOfTopUserAnswerTotals = async (params: {
  limit: number
  skip: number
  search?: string
  claimsDisabled?: boolean
}): Promise<UserAnswerTotal[]> => {
  const whereClause: Prisma.UserAnswerTotalWhereInput = {}
  
  if (params.search && params.search.length > 2) {
    // First, find matching user profiles
    const matchingProfiles = await prisma.userProfile.findMany({
      where: {
        OR: [
          {
            username: {
              contains: params.search,
              mode: 'insensitive'
            }
          },
          {
            display_name: {
              contains: params.search,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        fid: true
      }
    })

    console.table(matchingProfiles)
    
    const matchingFids = matchingProfiles.map(profile => profile.fid)
    
    if (matchingFids.length === 0) {
      // If no matching profiles found, return empty array
      return []
    }
    
    // Filter UserAnswerTotal to only include matching FIDs
    whereClause.fid = {
      in: matchingFids
    }
    console.log(whereClause)
  }

  if (params.claimsDisabled) {
    // Find users with claims disabled
    const claimsDisabledUsers = await prisma.spamScore.findMany({
      where: {
        preventClaiming: true
      },
      select: {
        fid: true
      }
    })
    
    const claimsDisabledFids = claimsDisabledUsers.map(user => user.fid)
    
    if (claimsDisabledFids.length === 0) {
      return []
    }
    
    // If we already have a search filter, combine with AND
    if (whereClause.fid) {
      const existingFids = (whereClause.fid as any).in || []
      const combinedFids = existingFids.filter((fid: number) => claimsDisabledFids.includes(fid))
      whereClause.fid = {
        in: combinedFids
      }
    } else {
      whereClause.fid = {
        in: claimsDisabledFids
      }
    }
  }

  const res = await prisma.userAnswerTotal.findMany({
    where: whereClause,
    take: params.limit,
    skip: params.skip,
    orderBy: {
      lastUpdated: "desc"
    }
  })
  console.log({
    where: whereClause,
    take: params.limit,
    skip: params.skip,
  })
  console.log(res)
  return res
}

export const countUserAnswerTotals = async (): Promise<number> => {
  return prisma.userAnswerTotal.count()
}
