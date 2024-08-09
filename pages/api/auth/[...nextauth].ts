import NextAuth, { type NextAuthOptions } from "next-auth"
import util from 'util'
import CredentialsProvider from "next-auth/providers/credentials"
import { createAppClient, viemConnector } from "@farcaster/auth-kit"
import { NextApiRequest, NextApiResponse } from "next"
import { channelFrames } from '../../../utils/frames/channelFrames'

const adminFids = (process.env.ADMIN_FIDS || '').split(',').map((fid) => parseInt(fid, 10))

export const authOptions: (req: NextApiRequest) => NextAuthOptions = (req) => ({
    jwt: {
      secret: process.env.NEXTAUTH_SECRET
    },
    providers: [
      CredentialsProvider({
        name: "Sign in with Farcaster",
        credentials: {
          message: {
            label: "Message",
            type: "text",
            placeholder: "0x0",
          },
          signature: {
            label: "Signature",
            type: "text",
            placeholder: "0x0",
          },
          // In a production app with a server, these should be fetched from
          // your Farcaster data indexer rather than have them accepted as part
          // of credentials.
          name: {
            label: "Name",
            type: "text",
            placeholder: "0x0",
          },
          pfp: {
            label: "Pfp",
            type: "text",
            placeholder: "0x0",
          },
        },
        async authorize(credentials) {
          const {
            body: { csrfToken },
          } = req

          const appClient = createAppClient({
            ethereum: viemConnector(),
          })

          const verifyResponse = await appClient.verifySignInMessage({
            message: credentials?.message as string,
            signature: credentials?.signature as `0x${string}`,
            domain: new URL(process.env.NEXTAUTH_URL || 'NEXTAUTH_URL must be set.').host,
            nonce: csrfToken,
          })
          const { success, fid, error } = verifyResponse

          if (!success) {
            console.error('Failed to verify sign in with Farcaster. Check domain in nextauth config and in utils/farcaster.ts')
            console.error('Farcaster error:', util.inspect(error, false, null, true))
            return null
          }

          return {
            id: fid.toString(),
            fid: fid.toString(),
            name: credentials?.name,
            image: credentials?.pfp,
          }
        }
      })
    ],
    callbacks: {
      jwt({ token, account, user }) {
        if (account) {
          token.accessToken = account.access_token
          token.id = user?.id
        }
        return token
      },
      session({ session, token }) {
        session.user.fid = token.id as string

        session.admin = adminFids.includes(parseInt(token.id as string, 10))
        session.channelAdmin = channelFrames.filter((channel) => {
          return channel.adminFid === parseInt(token.id as string, 10)
        })
        return session;
      }
    }
})

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return NextAuth(req, res, authOptions(req))
}
