declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

import NextAuth from "next-auth"

declare module "next-auth" {
  interface User extends NextAuth.User {
      fid: string
  }
  interface Session extends NextAuth.Session {
    user: User
    admin: boolean

    // i am of admin of these channels
    channelAdmin: { channelId: string, adminFid: number }[]
  }
}

interface Ethereum {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] | object }) => Promise<any>;
  on?: (eventName: string, callback: (...args: unknown[]) => void) => void;
}
declare global {
  interface Window {
    ethereum?: Ethereum
  }
}
