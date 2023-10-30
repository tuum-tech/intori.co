import type { IIdentifier, MinimalImportableKey } from "@veramo/core";
import type { Wallet } from "../thirdweb/localWallet";
import type { AccountInfo, VeramoState } from "./interfaces";
import { getVeramoAgent } from "./setup";
import { initAccountState } from "./state/account";
import { convertChainIdFromHex } from "./state/network";
import { CHAIN_ID } from "./types/constants";

export async function loadVeramoState(
  state: VeramoState,
  wallet: Wallet,
): Promise<VeramoState> {
  try {
    const evmAddress = wallet.address;

    // Initialize if not there
    if (evmAddress && !(evmAddress in state.identityData)) {
      console.log(
        `The address ${evmAddress} has NOT yet been configured. Configuring now...`,
      );
      state = await initAccountState(evmAddress);
    }
    return await veramoImportAccount(state, wallet);
  } catch (e) {
    console.error(`Error while trying to get the account: ${e}`);
    throw new Error(`Error while trying to get the account: ${e}`);
  }
}

export async function veramoImportAccount(
  state: VeramoState,
  wallet: Wallet,
): Promise<VeramoState> {
  const chainId = CHAIN_ID; // Only dealing with ETH Mainnet for now

  let privateKey = wallet.privateKey;
  let publicKey = wallet.publicKey;
  let address = wallet.address.toLowerCase();

  const method = state.currentAccount.didMethod;

  let did = "";
  if (method === "did:pkh") {
    did = `did:pkh:eip155:${convertChainIdFromHex(chainId)}:${address}`;
  } else {
    console.error(
      `Error while trying to generate DID. Invalid did method: "${method}`,
    );
    throw new Error(
      `Error while trying to generate DID. Invalid did method: "${method}`,
    );
  }

  if (!did) {
    console.log("Failed to generate DID");
    throw new Error("Failed to generate DID");
  }

  state.currentAccount.evmAddress = address;

  // Get Veramo agent
  const agent = await getVeramoAgent(state);
  const controllerKeyId = `intori-${address}`;
  console.log(
    `Importing using did=${did}, provider=${method}, controllerKeyId=${controllerKeyId}...`,
  );

  let identifier: IIdentifier;
  // Get identifier if it exists
  try {
    identifier = await agent.didManagerGet({
      did,
    });
  } catch (error) {
    try {
      identifier = await agent.didManagerImport({
        did,
        provider: method,
        controllerKeyId,
        keys: [
          {
            kid: controllerKeyId,
            type: "Secp256k1",
            kms: "intori",
            privateKeyHex: privateKey.replace(/^0x/, ""),
            publicKeyHex: publicKey.replace(/^0x/, ""),
          } as MinimalImportableKey,
        ],
      });
    } catch (e) {
      console.log("Error here: ", e);
      throw new Error("Error here: ", e);
    }
  }
  console.log("Imported successfully");

  const account: AccountInfo = {
    evmAddress: address,
    did: did,
    didMethod: method,
  } as AccountInfo;

  state.currentAccount = account;
  return state;
}
