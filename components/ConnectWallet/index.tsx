import React, { useState, useMemo } from 'react'
import { useEthereumWallet } from '../../contexts/EthereumWallet'
import styles from './styles.module.css'

export const ConnectWalletButton: React.FC = () => {
  const {
    address,
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

  const formattedAddress = useMemo(() => {
    if (address) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    return ''
  },[address])

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

