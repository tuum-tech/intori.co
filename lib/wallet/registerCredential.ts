import { BigNumber } from 'ethers'

export type TransactionType = {
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
