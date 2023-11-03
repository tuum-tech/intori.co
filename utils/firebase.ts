import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  AppCheck,
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

// Initialize Firebase services
let analytics: Analytics
let auth: Auth
let functions: Functions
let firestore: Firestore
let appCheck: AppCheck

// This function initializes Firebase Analytics and App Check if supported and on the client side
const initFirebaseClientSide = () => {
  if (typeof window !== 'undefined') {
    // Initialize Firebase Analytics
    isSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(firebaseApp)
        }
      })
      .catch((error) => {
        console.error('Analytics not supported', error)
      })

    // Initialize Firebase App Check
    appCheck = initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
    })

    // Initialize Auth
    auth = getAuth(firebaseApp)
    setPersistence(auth, browserLocalPersistence)

    // Initialize Functions
    functions = getFunctions(firebaseApp)

    // Initialize Firestore
    firestore = getFirestore(firebaseApp)

    // Connect to emulators if not in production
    if (process.env.NODE_ENV !== 'production') {
      connectAuthEmulator(auth, 'http://127.0.0.1:10001')
      connectFunctionsEmulator(functions, '127.0.0.1', 10002)
      connectFirestoreEmulator(firestore, '127.0.0.1', 10003)
    }
  }
}

initFirebaseClientSide()

export { analytics, appCheck, auth, firestore, functions }
