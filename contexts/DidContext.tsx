import { CredentialDetail } from '@/components/credentials/CredTypes'
import { UploadedDataDetail } from '@/components/upload/UploadedTypes'
import { AccountInfo, VeramoState } from '@/lib/veramo/interfaces'
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer
} from 'react'

type DidProviderProps = {
  children: ReactNode
}

// Define the shape of your state
interface DidState {
  selectedOrders: UploadedDataDetail[]
  credentialRows: CredentialDetail[]
  veramoState: {
    currentAccount: AccountInfo
    identityData: any
  }
}

// Define the shape of your actions
type DidAction =
  | { type: 'SET_VERAMO_STATE'; payload: DidState['veramoState'] }
  | { type: 'ADD_CREDENTIAL_ROW'; payload: CredentialDetail }
  | { type: 'SET_SELECTED_ORDERS'; payload: UploadedDataDetail[] }

interface DidContextType {
  state: DidState
  dispatch: Dispatch<DidAction>
}

const defaultDidState: DidState = {
  selectedOrders: [] as UploadedDataDetail[],
  credentialRows: [] as CredentialDetail[],
  veramoState: {
    currentAccount: {} as AccountInfo,
    identityData: {}
  } as VeramoState
}

// Define the reducer function
function didReducer(state: DidState, action: DidAction): DidState {
  switch (action.type) {
    case 'SET_VERAMO_STATE':
      return { ...state, veramoState: action.payload }
    case 'ADD_CREDENTIAL_ROW':
      return {
        ...state,
        credentialRows: [...state.credentialRows, action.payload]
      }
    case 'SET_SELECTED_ORDERS':
      return { ...state, selectedOrders: action.payload }
    default:
      return state
  }
}

const DidContext = createContext<DidContextType>({
  state: defaultDidState,
  dispatch: () => undefined
})

export const useDid = (): DidContextType => useContext(DidContext)

export const DidProvider = ({ children }: DidProviderProps) => {
  const [state, dispatch] = useReducer(
    didReducer,
    defaultDidState,
    (initialState) => {
      // Attempt to load `veramoState` from `localStorage` and if it exists, use it to override the initial state
      const storedVeramoState = localStorage.getItem('veramoState')
      const storedCredentialRows = localStorage.getItem('credentials')
      return {
        ...initialState,
        veramoState: storedVeramoState
          ? JSON.parse(storedVeramoState)
          : initialState.veramoState,
        credentialRows: storedCredentialRows
          ? JSON.parse(storedCredentialRows)
          : initialState.credentialRows
      }
    }
  )

  // Store state changes in localStorage
  useEffect(() => {
    localStorage.setItem('veramoState', JSON.stringify(state.veramoState))
    localStorage.setItem('credentials', JSON.stringify(state.credentialRows))
  }, [state.veramoState, state.credentialRows])

  return (
    <DidContext.Provider value={{ state, dispatch }}>
      {children}
    </DidContext.Provider>
  )
}
