import React, { useCallback, createContext, useState, useContext, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify'
import { connectWallet } from '../lib/wallet/connectWallet'
import { ethers } from 'ethers'

export type EthereumWalletContextType = {
  signer?: ethers.providers.JsonRpcSigner
  setSigner: Dispatch<SetStateAction<ethers.providers.JsonRpcSigner | undefined>>

  address?: string
  setAddress: Dispatch<SetStateAction<string | undefined>>

  notVerifiedAddressModalShowing: boolean
  setNotVerifiedAddressModalShowing: Dispatch<SetStateAction<boolean>>

  attemptToConnectWallet: () => Promise<void>
}

const WalletContext = createContext<EthereumWalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [
    notVerifiedAddressModalShowing,
    setNotVerifiedAddressModalShowing
  ] = useState(false)

  const attemptToConnectWallet = useCallback(async () => {
    try {
      const { signer, address } = await connectWallet()

      setSigner(signer)
      setAddress(address)

      toast.success('Wallet connected successfully!')
    } catch (err) {
      if ((err as Error).message === 'NOT_VERIFIED_ADDRESS') {
        setNotVerifiedAddressModalShowing(true)
      }

      setSigner(undefined)
      setAddress(undefined)
    }
  }, [])

  return (
    <WalletContext.Provider value={{
      signer,
      setSigner,

      address,
      setAddress,

      notVerifiedAddressModalShowing,
      setNotVerifiedAddressModalShowing,

      attemptToConnectWallet
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
