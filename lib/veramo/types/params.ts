import type {
  ProofFormat,
  VerifiableCredential,
  W3CVerifiableCredential,
} from "@veramo/core";
import type {
  QueryMetadata,
  SaveOptions,
} from "../plugins/verifiable-creds-manager";

export type CreateVCRequestParams = {
  vcValue: object;
  vcKey?: string;
  credTypes?: string[];
  options?: SaveOptions;
  accessToken?: string;
};

export type CreateVCResponseResult = {
  data: VerifiableCredential;
  metadata: QueryMetadata;
};

export type ProofInfo = {
  proofFormat?: ProofFormat;
  type?: string;
  domain?: string;
  challenge?: string;
};

export type CreateVPOptions = {
  store: string | string[];
};

export type CreateVPRequestParams = {
  vcIds?: string[];
  vcs?: W3CVerifiableCredential[];
  options?: CreateVPOptions;
  proofInfo?: ProofInfo;
};
