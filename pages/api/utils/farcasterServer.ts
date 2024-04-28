
import {
  getSSLHubRpcClient,
  UserDataType,
} from "@farcaster/hub-nodejs";

export const getUserProfilePictureFromFid = async (
  fid: number
): Promise<string> => {
  if (!process.env.HUB_URL) {
    console.error('No HUB_URL provided.')
    return ''
  }

  const client = getSSLHubRpcClient(process.env.HUB_URL);

  const result = await client.getUserData({
    fid,
    userDataType: UserDataType.PFP
  })

  client.close()

  let profileImageUrl: string = ''
  result.map((user) => {
    if (!user?.data?.userDataBody) {
      return null
    }
    profileImageUrl = user.data.userDataBody.value
  })

  return profileImageUrl
}
