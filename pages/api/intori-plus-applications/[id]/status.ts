import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "@/prisma"
import { IntoriPlusApplicationStatus } from "@prisma/client"
import { sendFrameNotification } from "@/utils/notifications"

const updateApplicationStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const session = await getServerSession(req, res, authOptions(req))

    if (!session?.user?.fid || !session?.admin) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { id } = req.query
    const { status } = req.body

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Application ID is required" })
    }

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Status must be either APPROVED or REJECTED" })
    }

    // Check if application exists
    const existingApplication = await prisma.intoriPlusApplication.findUnique({
      where: { id }
    })

    if (!existingApplication) {
      return res.status(404).json({ error: "Application not found" })
    }

    // Update the application status
    await prisma.intoriPlusApplication.update({
      where: { id },
      data: {
        status: status as IntoriPlusApplicationStatus
      }
    })

    if (status === "APPROVED") {
      await sendFrameNotification({
        fid: existingApplication.fid,
        title: "🌟 You’ve been approved for intori Plus!",
        body: "Check-ins and advanced features are now unlocked.",
        targetUrl: "https://frame.intori.co"
      })
    }

    res.status(200).json({
      success: true
    })
  } catch (error) {
    console.error("Error updating application status:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export default updateApplicationStatus
