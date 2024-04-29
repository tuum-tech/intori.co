
//          Type	Required	Description	                Default
// relay	  string	No	Farcaster Auth relay server URL	    https://relay.farcaster.xyz
// domain	  string	Yes	Domain of your application.	        None
// siweUri	string	Yes	A URI identifying your application.	None
// rpcUrl	  string	No	Optimism RPC server URL	            https://mainnet.optimism.io
// version	string	No	Farcaster Auth version	            v1
declare interface AuthKitConfig {
  relay?: string
  domain?: string
  siweUri?: string
  rpcUrl?: string
  version?: string
}

export const domainFromNextUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return new URL(process.env.NEXTAUTH_URL).host
  }

  return window.location.host
}

export const getAppUri = () => {
  if (process.env.NEXTAUTH_URL) {
    return new URL(process.env.NEXTAUTH_URL).href
  }

  return window.location.href
}

export const authKitConfig: AuthKitConfig = {
  // For a production app, replace this with an Optimism Mainnet
  // RPC URL from a provider like Alchemy or Infura.
  rpcUrl: 'https://mainnet.optimism.io',
  domain: domainFromNextUrl(),

  // extra slash at end is important.
  siweUri: getAppUri()
}
