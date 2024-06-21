import React, { useState } from 'react'
import { useEthereumWallet } from '../../contexts/EthereumWallet'
import styles from './styles.module.css'

export const ConnectWalletButton: React.FC = () => {
  const {
    address,
    formattedAddress,
    attemptToConnectWallet
  } = useEthereumWallet()
  const [loading, setLoading] = useState<boolean>(false)

  const onClick = async () => {
    if (loading) {
      return
    }

    setLoading(true)

    await attemptToConnectWallet()

    setLoading(false)
  }


  if (address) {
    return (
      <div className={styles.address}>
        {formattedAddress}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={loading}
    >
      Connect ETH Wallet
    </button>
  )
}

