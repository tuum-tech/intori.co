import React, { useCallback, createContext, useState, useContext, Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UserAnswerPageType } from '../models/userAnswers'
import { TransactionType } from '../lib/ethers/registerCredential'
import abi from '../contracts/CredentialRegistryABI.json'
import { getNetworkParamsByChainId } from '../lib/ethers/networks'

export type EthereumWalletContextType = {
  signer?: ethers.providers.JsonRpcSigner
  setSigner: Dispatch<SetStateAction<ethers.providers.JsonRpcSigner | undefined>>

  address?: string
  setAddress: Dispatch<SetStateAction<string | undefined>>

  chainId?: number
  setChainId: Dispatch<SetStateAction<number | undefined>>

  notVerifiedAddressModalShowing: boolean
  setNotVerifiedAddressModalShowing: Dispatch<SetStateAction<boolean>>

  attemptToConnectWallet: () => Promise<void>
  registerCredential: (response: UserAnswerPageType) => Promise<TransactionType|null>
}

const WalletContext = createContext<EthereumWalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [chainId, setChainId] = useState<number | undefined>(undefined)
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [
    notVerifiedAddressModalShowing,
    setNotVerifiedAddressModalShowing
  ] = useState(false)

  const attemptToConnectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('No Ethereum provider found. Please install MetaMask.')
      return
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    try {
      await axios.post('/api/wallet/verify', { address });
    } catch (err) {
      setNotVerifiedAddressModalShowing(true)
      return
    }

    const expectedNetworkChainId =  (
      `0x${parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '0', 10).toString(16)}`
    )

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: expectedNetworkChainId
        }]
      })
    } catch (err) {
      if ((err as { code: number })?.code !== 4902) {
        toast.error('Failed to switch network to Base. Please try again')
        return
      }

      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            getNetworkParamsByChainId(expectedNetworkChainId)
          ]
        })
      } catch (err) {
        toast.error('Failed to switch network to Base. Please try again')
        return
      }
    }

    setSigner(signer)
    setAddress(address)

    toast.success('Wallet connected successfully! You can now publish your answers to Base.')
  }, [])

  const registerCredential = useCallback(async (response: UserAnswerPageType) => {
    if (!signer) {
      toast.info('Please connect your wallet first.')
      return null
    }

    // get VC from api route
    const res = await axios.post('/api/publish', {
        question: response.question,
        answer: response.answer
    })

    const {
      verifiableCredential,
      userDecentralizedIdentifier
    } = res.data

    const contractAddress = (
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'Enter valid address to .env.local'
    )

    const contract = new ethers.Contract(contractAddress, abi, signer)

    const credentialHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(
        JSON.stringify(verifiableCredential.credentialSubject)
      )
    )

    const credentialId = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(
        [
          verifiableCredential.credentialSubject.timestamp,
          verifiableCredential.credentialSubject.question,
          verifiableCredential.credentialSubject.answer
        ].join()
      )
    )

    console.log(
      {
        credentialId,
        credentialHash,
      },
      userDecentralizedIdentifier.did,
      'IntoriAnswerCredential'
    )

    const blockchainTransaction = await contract.registerCredential(
      credentialId,
      userDecentralizedIdentifier.did,
      credentialHash,
      'IntoriAnswerCredential'
    )

    await blockchainTransaction.wait()

    await axios.post('/api/publish/finish', {
        question: response.question,
        blockchainTransaction
    })

    toast.success('Answer published!')

    return blockchainTransaction
  }, [signer])

  return (
    <WalletContext.Provider value={{
      signer,
      setSigner,

      address,
      setAddress,

      chainId,
      setChainId,

      notVerifiedAddressModalShowing,
      setNotVerifiedAddressModalShowing,

      attemptToConnectWallet,

      registerCredential
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useEthereumWallet = (): EthereumWalletContextType => {
  const context = useContext(WalletContext)

  if (!context) {
    throw new Error('useEthereumWallet must be used within an EthereumWalletProvider')
  }

  return context
}
