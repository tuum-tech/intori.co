const convertToHex = (num: number) => `0x${num.toString(16)}`;

export const baseMainnetParams = {
  chainId: convertToHex(8453),
  chainName: 'Base',
  rpcUrls: ['https://mainnet.base.org'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://base.blockscout.com/']
}

export const sepoliaTestnetParams = {
  chainId: convertToHex(84532),
  chainName: 'Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://sepolia-explorer.base.org']
}

export const localhostTestParams = {
  chainId: convertToHex(1337),
  chainName: 'Ganache Local',
  rpcUrls: ['http://127.0.0.1:8545'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['http://127.0.0.1:8545']
}

export const getNetworkParamsByChainId = (chainId: string) => {
  switch (chainId) {
    case convertToHex(8453):
      return baseMainnetParams;
    case convertToHex(84532):
      return sepoliaTestnetParams;
    case convertToHex(1337):
      return localhostTestParams;
    default:
      return null;
  }
}

export const getBlockExplorerUrlForTransaction = (hash: string): string => {
  const chainId =  (
    `0x${parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '0', 10).toString(16)}`
  )

  switch (chainId) {
    case convertToHex(8453):
      return `https://base.blockscout.com/tx/${hash}`
    case convertToHex(84532):
      return `https://base-sepolia.blockscout.com/tx/${hash}`
    case convertToHex(1337):
      return `http://127.0.0.1:8545/tx/${hash}`
    default:
      return '';
  }
}
