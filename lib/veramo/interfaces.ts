import type { IIdentifier, IKey, W3CVerifiableCredential } from "@veramo/core";
import type { ManagedPrivateKey } from "@veramo/key-manager";

export type AccountInfo = {
  evmAddress: string;
  did: string;
  didMethod: string;
};

export type VeramoState = {
  currentAccount: AccountInfo;
  identityData: Record<string, IdentityData>; // mapping(evmAddress -> identityData)
};

/**
 * Identity Data for a MetaMask address
 */
export type IdentityData = {
  localKeyStore: Record<string, IKey>; // mapping(did -> key)
  localPrivateKeyStore?: Record<string, ManagedPrivateKey>; // mapping(did -> privatekey)
  identifiers: Record<string, IIdentifier>; // mapping(did -> identifier)
  vcs: Record<string, W3CVerifiableCredential>; // mapping(vcId -> VC)
};
