import type { ProofFormat } from "@veramo/core";

export const CHAIN_ID = "0x1";

export const isIn = <T>(values: readonly T[], value: any): value is T => {
  return values.includes(value);
};

export const availableMethods = ["did:pkh", "did:web"] as const;
export const isValidMethod = (x: string) => isIn(availableMethods, x);

export const availableProofFormats = [
  "jwt" as ProofFormat,
  "lds" as ProofFormat,
  "EthereumEip712Signature2021" as ProofFormat,
] as const;
export const isValidProofFormat = (x: string) => isIn(availableProofFormats, x);
