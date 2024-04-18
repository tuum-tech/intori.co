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
  }
}
