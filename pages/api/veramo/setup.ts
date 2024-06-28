import {
  createAgent,
  ICredentialPlugin,
  IDataStore,
  IDIDManager,
  IKeyManager,
  IMessageHandler,
  IResolver,
  TAgent
} from '@veramo/core';
import {
  CredentialIssuerEIP712,
  ICredentialIssuerEIP712
} from '@veramo/credential-eip712';
import { CredentialPlugin, W3cMessageHandler } from '@veramo/credential-w3c';
import { DIDComm, DIDCommMessageHandler, IDIDComm } from '@veramo/did-comm';
import { JwtMessageHandler } from '@veramo/did-jwt';
import {
  DIDManager
} from '@veramo/did-manager';
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key';
import { getDidPkhResolver, PkhDIDProvider } from '@veramo/did-provider-pkh';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { MessageHandler } from '@veramo/message-handler';
import {
  ISelectiveDisclosure
} from '@veramo/selective-disclosure';
import { Resolver } from 'did-resolver';
import { 
  FirebaseKeyStore,
  FirebasePrivateKeyStore,
  FirebaseDIDStore
} from './FirebaseKeyStore'
import { VeramoStateType } from './state'

type VeramoAgent = TAgent<
    IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    IMessageHandler &
    IDIDComm &
    ICredentialPlugin &
    ICredentialIssuerEIP712 &
    ISelectiveDisclosure
>

export const getAgent = async (
  state: VeramoStateType
): Promise<VeramoAgent> => {
  return await setup(state)
};

const setup = async (state: VeramoStateType): Promise<VeramoAgent> => {
  const agent = createAgent<
      IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      IMessageHandler &
      IDIDComm &
      ICredentialPlugin &
      ICredentialIssuerEIP712 &
      ISelectiveDisclosure
  >({
    plugins: [
      new KeyManager({
        store: new FirebaseKeyStore(state),
        kms: {
          local: new KeyManagementSystem(new FirebasePrivateKeyStore(state))
        },
      }),
      new DIDManager({
        store: new FirebaseDIDStore(state),
        defaultProvider: 'did:ethr:goerli',
        providers: {
          'did:key': new KeyDIDProvider({
            defaultKms: 'local',
          }),
          'did:pkh': new PkhDIDProvider({
            defaultKms: 'local',
          })
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...getDidKeyResolver(),
          ...getDidPkhResolver()
        }),
      }),
      new MessageHandler({
        messageHandlers: [
          new DIDCommMessageHandler(),
          new JwtMessageHandler(),
          new W3cMessageHandler()
        ],
      }),
      new DIDComm(),
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
    ],
  })

  return agent
}
