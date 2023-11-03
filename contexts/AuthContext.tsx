import { analytics, auth, functions } from '@/utils/firebase'
import { logEvent } from 'firebase/analytics'
import { signInWithCustomToken, signOut } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'
import { Magic, type MagicUserMetadata } from 'magic-sdk'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

type CustomTokenResponse = {
  customToken: string
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({
  isLoggedIn: false,
  loading: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loginWithEmail: async (email: string): Promise<boolean> => {
    throw new Error('loginWithEmail function not implemented')
  },
  logout: async () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [magic, setMagic] = useState<Magic | null>(null) // State to store the Magic instance

  useEffect(() => {
    // Only instantiate Magic on the client side
    if (typeof window !== 'undefined' && !magic) {
      const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY!)
      setMagic(magicInstance)
      magicInstance.preload().then(() => console.log('Magic <iframe> loaded.'))
    }
  }, [magic]) // Dependency array with `magic` ensures effect only runs when `magic` is null

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loginWithEmail = async (email: string) => {
    try {
      if (magic) {
        await magic.auth.loginWithEmailOTP({ email })
      } else {
        throw new Error('Magic is not initialized')
      }

      const userInfo: MagicUserMetadata = await magic.user.getInfo()
      console.log('User Login: ', JSON.stringify(userInfo))

      const createCustomTokenFunction = httpsCallable(functions, 'login')
      const magicIdToken = await magic.user.getIdToken()
      const functionResult = await createCustomTokenFunction({
        magicIdToken,
        userInfo
      })
      const customToken = (functionResult.data as CustomTokenResponse)
        .customToken
      await signInWithCustomToken(auth, customToken)
      if (analytics) {
        logEvent(analytics, 'login', userInfo)
      } else {
        // Handle the case where `analytics` is undefined
      }
      localStorage.setItem('magicUserInfo', JSON.stringify(userInfo))
      return true
    } catch (error) {
      console.log(`Error while logging in with Email: ${error}`)
      return false
    }
  }

  const logout = async () => {
    try {
      let userInfo: MagicUserMetadata | null = null

      if (magic) {
        try {
          userInfo = await magic.user.getInfo()
        } catch (infoError) {
          console.warn('Unable to fetch user info:', infoError)
        }
      } else {
        throw new Error('Magic is not initialized')
      }

      try {
        await magic.user.logout()
      } catch (logoutError) {
        // Check if logoutError is an object and has a property named 'code'
        if (
          typeof logoutError === 'object' &&
          logoutError !== null &&
          'error_code' in logoutError
        ) {
          const errorObj = logoutError as { error_code?: string } // Type assertion
          if (
            errorObj.error_code === 'auth_relayer/UNABLE_TO_REFRESH_SESSION'
          ) {
            console.warn('Magic session refresh failed, proceeding with logout')
          } else {
            throw logoutError // If it's another error, re-throw it
          }
        } else {
          throw logoutError // If it's not an object or doesn't have a 'code' property, re-throw it
        }
      }

      // Logging out from Firebase
      await signOut(auth)

      if (analytics && userInfo) {
        // Log the event to firebase
        logEvent(analytics, 'logout', userInfo)
      }

      localStorage.removeItem('magicUserInfo')
    } catch (error) {
      console.log(`Error while logging out: ${error}`)
      throw new Error(`Error while logging out: ${error}`)
    }
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loading, loginWithEmail, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}
