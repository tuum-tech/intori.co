import axios from 'axios'
import { ethers } from 'ethers'

export const connectWallet = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    try {
      await axios.post('/api/wallet/verify', { address });
    } catch (err) {
      throw new Error('NOT_VERIFIED_ADDRESS')
    }

    return { signer, address };
  }

  throw new Error('NO_ETHEREUM_PROVIDER')
}
