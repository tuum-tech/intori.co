import { ethers, BigNumber } from 'ethers'
import { VerifiableCredential, IIdentifier } from '@veramo/core'
import abi from '../../contracts/CredentialRegistryABI.json'

type TransactionType = {
  hash: string;
  type: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  confirmations: number;
  from: string;
  gasPrice: BigNumber;
  gasLimit: BigNumber;
  to: string;
  value: BigNumber;
  nonce: number;
  data: string;
  r: string;
  s: string;
  v: number;
  chainId: number;
}

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL ?? 'http://localhost:8545'
)
const signer = provider.getSigner()
const contractAddress = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'Enter valid address to .env.local'
)

const contract = new ethers.Contract(contractAddress, abi, signer)

export async function registerCredential(
  body: VerifiableCredential,
  decentralizedIdentifier: IIdentifier
): Promise<TransactionType> {
  const credentialHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(body.credentialSubject))
  )

  const credentialId = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(body.credentialSubject.timestamp)
  )

  const transaction = await contract.registerCredential(
    credentialId,
    decentralizedIdentifier.did,
    credentialHash,
    'IntoriAnswerCredential'
  )

  await transaction.wait()

  return transaction
}
