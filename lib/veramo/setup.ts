// Core interfaces
import {
  createAgent,
  type ICredentialPlugin,
  type IDataStore,
  type IDIDManager,
  type IKeyManager,
  type IResolver,
  type TAgent,
} from "@veramo/core";

// Core identity manager plugin
import { AbstractIdentifierProvider, DIDManager } from "@veramo/did-manager";

// Pkh did identity provider
import { getDidPkhResolver, PkhDIDProvider } from "@veramo/did-provider-pkh";

// Web did identity provider
import { WebDIDProvider } from "@veramo/did-provider-web";

// Core key manager plugin
import { KeyManager } from "@veramo/key-manager";

// Custom key management system for RN
import { KeyManagementSystem } from "@veramo/kms-local";

// W3C Verifiable Credential plugin
import { CredentialPlugin } from "@veramo/credential-w3c";

// Custom resolvers
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";
import type { VeramoState } from "./interfaces";
import {
  IntoriDIDStore,
  IntoriKeyStore,
  IntoriPrivateKeyStore,
  IntoriVCStore,
} from "./plugins/data-store/intori";
import {
  AbstractDataStore,
  DataManager,
  type IDataManager,
} from "./plugins/verifiable-creds-manager";

export type Agent = TAgent<
  IKeyManager &
    IDIDManager &
    IResolver &
    IDataManager &
    ICredentialPlugin &
    IDataStore
>;

/**
 * Get Veramo agent.
 *
 * @param state - VeramoState.
 * @returns Agent.
 */
export async function getVeramoAgent(state: VeramoState): Promise<Agent> {
  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractDataStore> = {};

  didProviders["did:pkh"] = new PkhDIDProvider({ defaultKms: "intori" });
  didProviders["did:web"] = new WebDIDProvider({ defaultKms: "intori" });

  vcStorePlugins.intori = new IntoriVCStore(state);

  const agent = createAgent<
    IKeyManager &
      IDIDManager &
      IResolver &
      IDataManager &
      ICredentialPlugin &
      IDataStore
  >({
    plugins: [
      new KeyManager({
        store: new IntoriKeyStore(state),
        kms: {
          intori: new KeyManagementSystem(new IntoriPrivateKeyStore(state)),
        },
      }),
      new DIDManager({
        store: new IntoriDIDStore(state),
        defaultProvider: "did:pkh",
        providers: didProviders,
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...getDidPkhResolver(),
          ...webDidResolver(),
        }),
      }),
      new DataManager({ store: vcStorePlugins }),
      new CredentialPlugin(),
    ],
  });
  return agent;
}
