import type { AccountInfo, IdentityData, VeramoState } from "../interfaces";

/**
 * Function that creates an empty VeramoState object in the Identity Snap state for the provided address.
 *
 * @param evmAddress - The account address.
 */
export async function initAccountState(
  evmAddress: string,
): Promise<VeramoState> {
  const didMethod = "did:pkh";
  const state = {
    currentAccount: { evmAddress, didMethod } as AccountInfo,
    identityData: {
      [evmAddress]: {
        localKeyStore: {},
        localPrivateKeyStore: {},
        identifiers: {},
        vcs: {},
      } as IdentityData,
    },
  } as VeramoState;
  return state;
}
