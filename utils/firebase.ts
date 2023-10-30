import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck
} from 'firebase/app-check'

import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
  type Auth
} from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore
} from 'firebase/firestore' // <-- Import Firestore modules
import {
  connectFunctionsEmulator,
  getFunctions,
  type Functions
} from 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig)

// Create a ReCaptchaEnterpriseProvider instance using reCAPTCHA Enterprise
// site key and passing it to initializeAppCheck().
const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaEnterpriseProvider(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
  ),
  isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
})

// Initialize analytics
let analytics: Analytics | undefined

// This ensures Firebase Analytics is only initialized on the client side
const initAnalytics = () => {
  if (typeof window !== 'undefined' && !analytics) {
    // isSupported() checks for compatibility with the current environment
    isSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(firebaseApp)
        }
      })
      .catch((error) => {
        console.error('Analytics not supported', error)
      })
  }
}

// Call this function at the top-level of a component, or within a useEffect hook
initAnalytics()

const auth: Auth = getAuth(firebaseApp) // Initialize Auth
// User will remain logged in even after closing and reopening the app
setPersistence(auth, browserLocalPersistence)

const functions: Functions = getFunctions(firebaseApp) // Initialize Functions
const firestore: Firestore = getFirestore(firebaseApp) // <-- Initialize Firestore

// When working locally, we can just use the firestore emulator for testing purposes
if (process.env.NODE_ENV !== 'production') {
  connectAuthEmulator(auth, 'http://127.0.0.1:10001')
  connectFunctionsEmulator(functions, '127.0.0.1', 10002)
  connectFirestoreEmulator(firestore, '127.0.0.1', 10003)
}

export { analytics, appCheck, auth, firestore, functions }
