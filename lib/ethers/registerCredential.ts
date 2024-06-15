import { ethers } from 'ethers'
import abi from '../../contracts/CredentialRegistryABI.json'

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'http://localhost:8545'
)
const signer = provider.getSigner()
const contractAddress = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'Enter valid address to .env.local'
)

const contract = new ethers.Contract(contractAddress, abi, signer)

export async function registerCredential(
  body: {
    credentialId: string,
    recipientDid: string,
    credentialHash: string,
    credentialType: string
  }
) {
  const { credentialId, recipientDid, credentialHash, credentialType } = body

  const tx = await contract.registerCredential(
    credentialId,
    recipientDid,
    credentialHash,
    credentialType
  )

  await tx.wait()

  console.log('Transaction hash:', tx.hash)
}
