import { neynar } from './neynarApi'
import { getSavedMembersOfChannel } from '../models/channelMembers'

export const setupReactionsWebhookForChannelModerators = async (channelId: string): Promise<void> => {
  if (!process.env.NEXTAUTH_URL) {
    throw Error("NEXTAUTH_URL is not set in .env.local file. Please set it to the URL of your Next.js app.")
  }

  const moderatorsOfChannel = await getSavedMembersOfChannel({ channelId, role: 'moderator' })
  const moderatorFids = moderatorsOfChannel.map(moderator => moderator.fid)

  const webhookName = `Moderator Reactions for ${channelId}`
  const webhookUrl = process.env.NEXTAUTH_URL + '/api/reactions/' + channelId

  await neynar.publishWebhook(webhookName, webhookUrl, {
    subscription: {
      'reaction.created': {
        fids: moderatorFids
      }
    }
  })
}
