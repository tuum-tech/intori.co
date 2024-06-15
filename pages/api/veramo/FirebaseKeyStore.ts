import { IKey, IIdentifier } from '@veramo/core'
import { AbstractDIDStore } from '@veramo/did-manager'
import {
  AbstractKeyStore,
  AbstractPrivateKeyStore,
  ManagedPrivateKey,
  ImportablePrivateKey
} from '@veramo/key-manager'
import { createDb } from '../utils/firestore'
import { VeramoStateType } from './state'

const db = createDb()
const keyStoreCollectionName = 'veramoKeyStore'
const privateKeyStoreCollectionName = 'veramoPrivateKeyStore'

// For each key and VC, we need to keep track of the fid that created it.
interface IntoriKey extends IKey {
  fid: number
}

interface IntoriManagedPrivateKey extends ManagedPrivateKey {
  fid: number
}

interface IntoriDecentralizedIdentifier extends IIdentifier {
  fid: number
}

export class FirebaseKeyStore extends AbstractKeyStore {
  private state: VeramoStateType

  constructor(incomingState: VeramoStateType) {
    super()

    this.state = incomingState
  }

  async getKey({ kid }: { kid: string }) {
    const doc = await db.collection(keyStoreCollectionName).doc(kid).get()

    if (!doc.exists) {
      throw new Error(`Key not found: ${kid}`)
    }

    const key = doc.data() as IntoriKey

    // check if it was created by this fid
    if (key.fid !== this.state.fid) {
      throw new Error(`Key not found: ${kid}`)
    }

    return key
  }

  async deleteKey({ kid }: { kid: string }) {
    const doc = await db.collection(keyStoreCollectionName).doc(kid).get()
    const keyToDelete = doc.data()

    // check if key exists and if it was created by this fid
    if (!keyToDelete || (keyToDelete as IntoriKey).fid !== this.state.fid) {
      throw new Error(`Key not found: ${kid}`)
    }

    await db.collection(keyStoreCollectionName).doc(kid).delete()

    return true
  }

  async importKey(key: IKey): Promise<boolean> {
    await db.collection(keyStoreCollectionName).doc(key.kid).set({
      ...key,
      fid: this.state.fid
    })

    return true
  }

  async listKeys(): Promise<Array<IntoriKey>> {
    const snapshot = await db.collection(keyStoreCollectionName).get()
    const keys = snapshot.docs.map(doc => doc.data() as IntoriKey)

    // only get keys that were created by this fid
    return keys.filter(key => (key as IntoriKey).fid === this.state.fid)
  }
}

export class FirebasePrivateKeyStore extends AbstractPrivateKeyStore {
  private state: VeramoStateType

  constructor(incomingState: VeramoStateType) {
    super()
    this.state = incomingState
  }

  async getKey({ alias }: { alias: string }): Promise<IntoriManagedPrivateKey> {
    const doc = await db.collection(privateKeyStoreCollectionName).doc(alias).get()

    const data = doc?.data() as IntoriManagedPrivateKey
    if (!doc.exists || !data || data.fid !== this.state.fid) {
      throw new Error(`Private key not found: ${alias}`)
    }

    return data
  }

  async importKey(args: ImportablePrivateKey) {
    const alias = args.alias || this.state.fid.toString()

    const docRef = db.collection(privateKeyStoreCollectionName).doc(alias)
    await docRef.set({
      ...args,
      fid: this.state.fid,
      alias
    })

    const data = (await docRef.get()).data()

    return data as IntoriManagedPrivateKey
  }

  async listKeys(): Promise<IntoriManagedPrivateKey[]> {
    const docs = await db.collection(privateKeyStoreCollectionName).get()

    const keys = docs.docs.map(doc => doc.data() as IntoriManagedPrivateKey)

    // only get keys that were created by this fid
    return keys.filter((key) => key.fid === this.state.fid)
  }

  async deleteKey({ alias }: { alias: string }) {
    const doc = await db.collection(privateKeyStoreCollectionName).doc(alias).get()

    const keyToDelete = doc.data()

    // check if key exists and if it was created by this fid
    if (!keyToDelete || (keyToDelete as IntoriManagedPrivateKey).fid !== this.state.fid) {
      throw new Error(`Key not found: ${alias}`)
    }

    await db.collection(keyStoreCollectionName).doc(alias).delete()

    return true
  }
}
const didStoreCollectionName = 'veramoDIDStore'

export class FirebaseDIDStore extends AbstractDIDStore {
  private state: VeramoStateType

  constructor(incomingState: VeramoStateType) {
    super()

    this.state = incomingState
  }

  async getDID(args: { did: string, alias: string }): Promise<IntoriDecentralizedIdentifier> {
    const { did } = args

    const doc = await db.collection(didStoreCollectionName).doc(did).get()

    if (!doc.exists) {
      throw new Error(`DID not found: ${did}`)
    }

    const identifier = doc.data() as IntoriDecentralizedIdentifier

    if (identifier.fid !== this.state.fid) {
      throw new Error(`DID not found: ${did}`)
    }

    return identifier
  }

  async deleteDID(args: {
    did: string;
  }): Promise<boolean> {
    const { did } = args

    const doc = await db.collection(didStoreCollectionName).doc(did).get()

    const didToDelete = doc.data()

    if (
      !didToDelete ||
      (didToDelete as IntoriDecentralizedIdentifier).fid !== this.state.fid
    ) {
      throw new Error(`DID not found: ${did}`)
    }

    await db.collection(didStoreCollectionName).doc(did).delete()

    return true
  }

  async importDID(args: IIdentifier): Promise<boolean> {
    await db.collection(didStoreCollectionName).doc(args.did).set({
      ...args,
      fid: this.state.fid
    })

    return true
  }

  async listDIDs(): Promise<IntoriDecentralizedIdentifier[]> {
    const snapshot = await db.collection(didStoreCollectionName).get()

    const dids =  snapshot.docs.map(doc => doc.data() as IntoriDecentralizedIdentifier)

    return dids.filter((did) => did.fid === this.state.fid)
  }
}

