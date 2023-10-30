import type {
  IIdentifier,
  IKey,
  VerifiableCredential,
  W3CVerifiableCredential,
} from "@veramo/core";
import { AbstractDIDStore } from "@veramo/did-manager";
import {
  AbstractKeyStore,
  AbstractPrivateKeyStore,
  type ImportablePrivateKey,
  type ManagedPrivateKey,
} from "@veramo/key-manager";
import jsonpath from "jsonpath";
import { v4 as uuidv4 } from "uuid";
import type { VeramoState } from "../../../../interfaces";
import { decodeJWT } from "../../../../utils/jwt";
import {
  AbstractDataStore,
  type IFilterArgs,
  type IQueryResult,
  type ISaveVC,
} from "../../../verifiable-creds-manager";

/**
 * An implementation of {@link AbstractKeyStore} that holds everything in local state.
 *
 * This is usable by {@link @veramo/kms-local} to hold the key data.
 */
export class IntoriKeyStore extends AbstractKeyStore {
  state: VeramoState;

  constructor(state: VeramoState) {
    super();
    this.state = state;
  }

  async getKey({ kid }: { kid: string }): Promise<IKey> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriKeyStore - Cannot get current account: ${account}`);
    }

    const accountState = this.state.identityData[account];
    const key = accountState.localKeyStore[kid];
    if (!key) {
      throw Error(`IntoriKeyStore - kid '${kid}' not found`);
    }
    return key;
  }

  async deleteKey({ kid }: { kid: string }) {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriKeyStore - Cannot get current account: ${account}`);
    }

    const accountState = this.state.identityData[account];
    if (!accountState.localKeyStore[kid]) {
      throw Error(`IntoriKeyStore - kid '${kid}' not found`);
    }

    delete this.state.identityData[account].localKeyStore[kid];
    return true;
  }

  async importKey(args: IKey) {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriKeyStore - Cannot get current account: ${account}`);
    }

    this.state.identityData[account].localKeyStore[args.kid] = {
      ...args,
    };
    return true;
  }

  async listKeys(): Promise<Exclude<IKey, "privateKeyHex">[]> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriKeyStore - Cannot get current account: ${account}`);
    }

    const accountState = this.state.identityData[account];
    const safeKeys = Object.values(accountState.localKeyStore).map((key) => {
      const { privateKeyHex, ...safeKey } = key;
      return safeKey;
    });
    return safeKeys;
  }
}

/**
 * An implementation of {@link AbstractPrivateKeyStore} that holds everything in local state.
 *
 * This is usable by {@link @veramo/kms-local} to hold the key data.
 */
export class IntoriPrivateKeyStore extends AbstractPrivateKeyStore {
  state: VeramoState;

  constructor(state: VeramoState) {
    super();
    this.state = state;
  }

  async getKey({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(
        `IntoriPrivateKeyStore - Cannot get current account: ${account}`,
      );
    }

    const accountState = this.state.identityData[account];
    const key = accountState.localPrivateKeyStore[alias];
    if (!key) {
      throw Error(
        `IntoriPrivateKeyStore - not_found: PrivateKey not found for alias=${alias}`,
      );
    }
    return key;
  }

  async deleteKey({ alias }: { alias: string }) {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(
        `IntoriPrivateKeyStore - Cannot get current account: ${account}`,
      );
    }

    const accountState = this.state.identityData[account];
    if (!accountState.localPrivateKeyStore[alias]) {
      throw Error("IntoriPrivateKeyStore - Key not found");
    }

    delete this.state.identityData[account].localPrivateKeyStore[alias];
    return true;
  }

  async importKey(args: ImportablePrivateKey) {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(
        `IntoriPrivateKeyStore - Cannot get current account: ${account}`,
      );
    }

    const alias = args.alias || uuidv4();
    const accountState = this.state.identityData[account];
    const existingEntry = accountState.localPrivateKeyStore[alias];
    if (existingEntry && existingEntry.privateKeyHex !== args.privateKeyHex) {
      console.error(
        "IntoriPrivateKeyStore - key_already_exists: key exists with different data, please use a different alias",
      );
      throw new Error(
        "IntoriPrivateKeyStore - key_already_exists: key exists with different data, please use a different alias",
      );
    }

    this.state.identityData[account].localPrivateKeyStore[alias] = {
      ...args,
      alias,
    };
    return this.state.identityData[account].localPrivateKeyStore[alias];
  }

  async listKeys(): Promise<ManagedPrivateKey[]> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(
        `IntoriPrivateKeyStore - Cannot get current account: ${account}`,
      );
    }

    const accountState = this.state.identityData[account];
    return [...Object.values(accountState.localPrivateKeyStore)];
  }
}

/**
 * An implementation of {@link AbstractDIDStore} that holds everything in local state.
 *
 * This is usable by {@link @veramo/did-manager} to hold the did key data.
 */
export class IntoriDIDStore extends AbstractDIDStore {
  state: VeramoState;

  constructor(state: VeramoState) {
    super();
    this.state = state;
  }

  async getDID({
    did,
    alias,
    provider,
  }: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriDIDStore - Cannot get current account: ${account}`);
    }
    const { identifiers } = this.state.identityData[account];

    if (did && !alias) {
      if (!identifiers[did]) {
        throw Error(
          `IntoriDIDStore - not_found: IIdentifier not found with did=${did}`,
        );
      }
      return identifiers[did];
    } else if (!did && alias && provider) {
      for (const key of Object.keys(identifiers)) {
        if (
          identifiers[key].alias === alias &&
          identifiers[key].provider === provider
        ) {
          return identifiers[key];
        }
      }
    } else {
      throw Error(
        "IntoriDIDStore - invalid_argument: Get requires did or (alias and provider)",
      );
    }
    throw Error(
      `IntoriDIDStore - not_found: IIdentifier not found with alias=${alias} provider=${provider}`,
    );
  }

  async deleteDID({ did }: { did: string }) {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriDIDStore - Cannot get current account: ${account}`);
    }

    const accountState = this.state.identityData[account];
    if (!accountState.identifiers[did]) {
      throw Error(
        `IntoriDIDStore - not_found: IIdentifier not found with did=${did}`,
      );
    }

    delete this.state.identityData[account].identifiers[did];
    return true;
  }

  async importDID(args: IIdentifier) {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriDIDStore - Cannot get current account: ${account}`);
    }

    const identifier = { ...args };

    for (const key of identifier.keys) {
      if ("privateKeyHex" in key) {
        delete key.privateKeyHex;
      }
    }

    console.log("account: ", account, " did: ", args.did);
    this.state.identityData[account].identifiers[args.did] = identifier;
    return true;
  }

  async listDIDs(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriDIDStore - Cannot get current account: ${account}`);
    }

    const accountState = this.state.identityData[account];
    let result: IIdentifier[] = [];
    for (const key of Object.keys(accountState.identifiers)) {
      result.push(accountState.identifiers[key]);
    }

    if (args.alias && !args.provider) {
      result = result.filter((i) => i.alias === args.alias);
    } else if (args.provider && !args.alias) {
      result = result.filter((i) => i.provider === args.provider);
    } else if (args.provider && args.alias) {
      result = result.filter(
        (i) => i.provider === args.provider && i.alias === args.alias,
      );
    }

    return result;
  }
}

/**
 * An implementation of {@link AbstractDataStore} that holds everything in snap state.
 *
 * This is usable by {@link @vc-manager/VCManager} to hold the vc data
 */
export class IntoriVCStore extends AbstractDataStore {
  state: VeramoState;

  configure: undefined;

  constructor(state: VeramoState) {
    super();
    this.state = state;
  }

  async queryVC(args: IFilterArgs): Promise<IQueryResult[]> {
    const { filter } = args;
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriVCStore - Cannot get current account: ${account}`);
    }

    const accountState = this.state.identityData[account];
    if (filter && filter.type === "id") {
      return Object.keys(accountState.vcs)
        .map((k) => {
          let vc = accountState.vcs[k] as unknown;
          if (typeof vc === "string") {
            vc = decodeJWT(vc);
          }
          return {
            metadata: { id: k },
            data: vc,
          };
        })
        .filter((item: any) => {
          return (
            item.metadata.id === (filter.filter as string) &&
            item.data.credentialSubject.id?.split(":")[4] === account
          );
        });
    }

    if (filter && filter.type === "vcType") {
      return Object.keys(accountState.vcs)
        .map((k) => {
          let vc = accountState.vcs[k] as unknown;
          if (typeof vc === "string") {
            vc = decodeJWT(vc);
          }
          return {
            metadata: { id: k },
            data: vc,
          };
        })
        .filter((item: any) => {
          return (
            item.data.type?.includes(filter.filter as string) &&
            item.data.credentialSubject.id?.split(":")[4] === account
          );
        });
    }

    if (filter === undefined || (filter && filter.type === "none")) {
      return Object.keys(accountState.vcs)
        .map((k) => {
          let vc = accountState.vcs[k] as unknown;
          if (typeof vc === "string") {
            vc = decodeJWT(vc);
          }
          return {
            metadata: { id: k },
            data: vc,
          };
        })
        .filter((item: any) => {
          return item.data.credentialSubject.id?.split(":")[4] === account;
        });
    }

    if (filter && filter.type === "JSONPath") {
      const objects = Object.keys(accountState.vcs)
        .map((k) => {
          let vc = accountState.vcs[k] as unknown;
          if (typeof vc === "string") {
            vc = decodeJWT(vc);
          }
          return {
            metadata: { id: k },
            data: vc,
          };
        })
        .filter((item: any) => {
          return item.data.credentialSubject.id?.split(":")[4] === account;
        });
      const filteredObjects = jsonpath.query(objects, filter.filter as string);
      return filteredObjects as IQueryResult[];
    }
    return [];
  }

  async saveVC(args: { data: ISaveVC[] }): Promise<string[]> {
    const { data: vcs } = args;

    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriVCStore - Cannot get current account: ${account}`);
    }

    const ids: string[] = [];
    for (const vc of vcs) {
      if (
        (vc.vc as VerifiableCredential).credentialSubject.id?.split(":")[4] ===
        account
      ) {
        const newId = vc.id || uuidv4();
        ids.push(newId);
        this.state.identityData[account].vcs[newId] =
          vc.vc as W3CVerifiableCredential;
      }
    }
    return ids;
  }

  async deleteVC({ id }: { id: string }): Promise<boolean> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriVCStore - Cannot get current account: ${account}`);
    }

    const accountState = this.state.identityData[account];
    if (!accountState.vcs[id]) {
      throw Error(`IntoriVCStore - VC ID '${id}' not found`);
    }

    delete this.state.identityData[account].vcs[id];
    return true;
  }

  public async clearVCs(_args: IFilterArgs): Promise<boolean> {
    const account = this.state.currentAccount.evmAddress;
    if (!account) {
      throw Error(`IntoriVCStore - Cannot get current account: ${account}`);
    }

    this.state.identityData[account].vcs = {};
    return true;
  }
}
