import { AccountInfo, IdentityData, VeramoState } from '@/lib/veramo/interfaces'
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
  veramoState: {
    currentAccount: AccountInfo
    identityData: Record<string, IdentityData>
  }
  isGeneratingCredentials: boolean
}

// Define the shape of your actions
type DidAction =
  | { type: 'SET_VERAMO_STATE'; payload: DidState['veramoState'] }
  | { type: 'SET_GENERATING_CREDENTIALS'; payload: boolean }

interface DidContextType {
  state: DidState
  dispatch: Dispatch<DidAction>
}

const defaultDidState: DidState = {
  veramoState: {
    currentAccount: {} as AccountInfo,
    identityData: {} as Record<string, IdentityData>
  } as VeramoState,
  isGeneratingCredentials: false
}

// Define the reducer function
function didReducer(state: DidState, action: DidAction): DidState {
  switch (action.type) {
    case 'SET_VERAMO_STATE':
      return { ...state, veramoState: action.payload }
    case 'SET_GENERATING_CREDENTIALS':
      return { ...state, isGeneratingCredentials: action.payload }
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

  // Store state changes in localStorage
  useEffect(() => {
    localStorage.setItem('veramoState', JSON.stringify(state.veramoState))
  }, [state.veramoState])

  // Expose state, dispatch in the context value
  return (
    <DidContext.Provider value={{ state, dispatch }}>
      {children}
    </DidContext.Provider>
  )
}
