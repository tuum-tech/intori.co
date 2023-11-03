import { LocalWallet, type AsyncStorage } from '@thirdweb-dev/wallets'
import { Wallet as WalletEthers, ethers } from 'ethers'

export type Wallet = {
  privateKey: string
  publicKey: string
  address: string
  localWallet: LocalWallet
}

export async function loadOrCreateWallet(): Promise<Wallet> {
  const localWallet = new LocalWallet()

  const config = {
    strategy: 'privateKey',
    encryption: false
  } as LoadOrCreateOptions
  // Load the saved wallet data from storage, if it exists, or generate a new one and save it.
  await localWallet.loadOrCreate(config)

  const privateKey = await localWallet.export(config)
  const wallet: WalletEthers = new ethers.Wallet(privateKey)
  return {
    privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address.toLowerCase(),
    localWallet
  } as Wallet
}

export async function exportWalletPrivateKey(wallet: Wallet): Promise<string> {
  const config = {
    strategy: 'privateKey',
    encryption: false
  } as ExportOptions
  // you can also export the wallet out of the application
  const exportedWallet = await wallet.localWallet.export(config)

  return exportedWallet
}

export async function exportWalletMnemonic(wallet: Wallet): Promise<string> {
  const config = {
    strategy: 'mnemonic',
    encryption: false
  } as ExportOptions
  // you can also export the wallet out of the application
  const exportedWallet = await wallet.localWallet.export(config)

  return exportedWallet
}

export async function importWalletUsingPrivateKey(
  privateKey: string
): Promise<Wallet> {
  const localWallet = new LocalWallet()

  const importConfig = {
    privateKey,
    encryption: false
  } as ImportOptions
  // Create a local wallet from an "encryptedJson", "privateKey" or "mnemonic"
  await localWallet.import(importConfig)

  const wallet: WalletEthers = new ethers.Wallet(privateKey)
  return {
    privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address,
    localWallet
  } as Wallet
}

type DecryptOptions =
  | {
      decrypt?: (message: string, password: string) => Promise<string>
      password: string
    }
  | false
type EncryptOptions =
  | {
      encrypt?: (message: string, password: string) => Promise<string>
      password: string
    }
  | false
type LoadOrCreateOptions =
  | {
      strategy: 'encryptedJson'
      password: string
      storage?: AsyncStorage
    }
  | {
      strategy: 'privateKey'
      storage?: AsyncStorage
      encryption: DecryptOptions
    }
type ImportOptions =
  | {
      privateKey: string
      encryption: DecryptOptions
    }
  | {
      mnemonic: string
      encryption: DecryptOptions
    }
  | {
      encryptedJson: string
      password: string
    }
type ExportOptions =
  | {
      strategy: 'encryptedJson'
      password: string
    }
  | {
      strategy: 'privateKey'
      encryption: EncryptOptions
    }
  | {
      strategy: 'mnemonic'
      encryption: EncryptOptions
    }
