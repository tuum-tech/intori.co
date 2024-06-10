import type { AccountInfo, VeramoState } from "./interfaces";

export async function getAccountInfo(state: VeramoState): Promise<AccountInfo> {
  const account = state.currentAccount;

  const accountInfo: AccountInfo = {
    evmAddress: account.evmAddress,
    did: account.did,
    didMethod: account.didMethod,
  };

  return accountInfo;
}
