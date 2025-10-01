import axios from 'axios'

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

export const domainFromNextUrl = (): string => {
  if (process.env.NEXTAUTH_URL) {
    return new URL(process.env.NEXTAUTH_URL).host
  }

  if (typeof window !== "undefined" && window.location?.host) {
    return window.location.host
  }

  // fallback (Vercel Preview/Prod)
  return process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000"
}

export const getAppUri = (): string => {
  if (process.env.NEXTAUTH_URL) {
    return new URL(process.env.NEXTAUTH_URL).href
  }

  if (typeof window !== "undefined" && window.location?.href) {
    return window.location.href
  }

  // fallback (Vercel Preview/Prod)
  const host = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000"
  return `https://${host}`
}

// 🟢 Changed: function instead of static object
export const getAuthKitConfig = (): AuthKitConfig => ({
  rpcUrl: 'https://mainnet.optimism.io',
  domain: domainFromNextUrl(),
  // extra slash at end is important
  siweUri: getAppUri(),
  version: 'v1',
})

