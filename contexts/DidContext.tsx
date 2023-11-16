import { CredentialDetail } from '@/components/credentials/CredTypes'
import { getVCsFirebase } from '@/lib/firebase/functions/getVCs'
import { AccountInfo, IdentityData, VeramoState } from '@/lib/veramo/interfaces'
import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'

type DidProviderProps = {
  children: ReactNode
}

// Define the shape of your state
interface DidState {
  credentialRows: CredentialDetail[]
  moreCredsToFetch: boolean
  veramoState: {
    currentAccount: AccountInfo
    identityData: Record<string, IdentityData>
  }
}

// Define the shape of your actions
type DidAction =
  | { type: 'SET_VERAMO_STATE'; payload: DidState['veramoState'] }
  | { type: 'SET_CREDENTIAL_ROWS'; payload: CredentialDetail[] }
  | { type: 'SET_MORECREDSTOFETCH'; payload: boolean }

interface DidContextType {
  state: DidState
  dispatch: Dispatch<DidAction>
  fetchCredentials: (options: {
    self?: boolean
    query?: { [key: string]: string }
    itemsPerPage?: number
    fetchEverything?: boolean
  }) => Promise<void>
}

const defaultDidState: DidState = {
  credentialRows: [] as CredentialDetail[],
  moreCredsToFetch: false,
  veramoState: {
    currentAccount: {} as AccountInfo,
    identityData: {} as Record<string, IdentityData>
  } as VeramoState
}

// Define the reducer function
function didReducer(state: DidState, action: DidAction): DidState {
  switch (action.type) {
    case 'SET_VERAMO_STATE':
      return { ...state, veramoState: action.payload }
    case 'SET_CREDENTIAL_ROWS':
      return { ...state, credentialRows: action.payload }
    case 'SET_MORECREDSTOFETCH':
      return { ...state, moreCredsToFetch: action.payload }
    default:
      return state
  }
}

const DidContext = createContext<DidContextType>({
  state: defaultDidState,
  dispatch: () => undefined,
  fetchCredentials: (_options: {
    self?: boolean
    query?: { [key: string]: string }
    itemsPerPage?: number
    fetchEverything?: boolean
  }) => Promise.resolve()
})

export const useDid = (): DidContextType => useContext(DidContext)

export const DidProvider = ({ children }: DidProviderProps) => {
  const [state, dispatch] = useReducer(
    didReducer,
    defaultDidState,
    (initialState) => {
      // Attempt to load the state from `localStorage`
      const storedVeramoState = localStorage.getItem('veramoState')
      return {
        ...initialState,
        veramoState: storedVeramoState
          ? JSON.parse(storedVeramoState)
          : initialState.veramoState
      }
    }
  )
  const [lastDocId, setLastDocId] = useState<string | null>(null)

  const fetchCredentials = useCallback(
    async (options: {
      self?: boolean
      query?: { [key: string]: string }
      itemsPerPage?: number
      fetchEverything?: boolean
    }) => {
      const fetchedCredentials = await getVCsFirebase({
        self: options.self ?? false,
        query: options.query ?? {},
        itemsPerPage: options.itemsPerPage ?? 5,
        startAfterDoc: lastDocId,
        fetchEverything: options.fetchEverything ?? false
      })
      console.log('fetchedCredentials: ', fetchedCredentials.length)
      console.log('lastDocId: ', lastDocId)
      dispatch({
        type: 'SET_MORECREDSTOFETCH',
        payload: fetchedCredentials.length === options.itemsPerPage
      })
      if (fetchedCredentials.length > 0) {
        dispatch({
          type: 'SET_CREDENTIAL_ROWS',
          payload: [...state.credentialRows, ...fetchedCredentials]
        })
        setLastDocId(
          fetchedCredentials[fetchedCredentials.length - 1].vCred.metadata
            .vcMetadata.id
        )
      } else {
        setLastDocId(null)
      }
    },
    [dispatch, state.credentialRows, lastDocId]
  )

  // Store state changes in localStorage
  useEffect(() => {
    localStorage.setItem('veramoState', JSON.stringify(state.veramoState))
  }, [state.veramoState])

  // Expose state, dispatch, and fetchCredentials in the context value
  return (
    <DidContext.Provider value={{ state, dispatch, fetchCredentials }}>
      {children}
    </DidContext.Provider>
  )
}
