import { prisma } from "@/prisma"

export const createUserUnlockedTopics = async (params: {
  fids: number[]
  topic: string
}): Promise<void> => {
  await prisma.userUnlockedTopic.createMany({
    data: params.fids.map((fid) => ({
      fid,
      topic: params.topic
    }))
  })
}
