import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { fetchVerifiedEthereumAddressesForUser } from '../../../utils/neynarApi'

const verifyWalletAddress = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const address = req.body.address.toString().toLowerCase()

  const session = await getServerSession(req, res, authOptions(req))

  if (!session?.user?.fid) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)

  const ethAddresses = await fetchVerifiedEthereumAddressesForUser(fid)
  const lowerCaseAddresses = ethAddresses.map(
    (address) => address.toLowerCase()
  )

  if (!lowerCaseAddresses.includes(address)) {
    return res.status(400).json({
      error: 'NOT_VERIFIED_ADDRESS'
    })
  }

  return res.status(200).end()
}

export default verifyWalletAddress
