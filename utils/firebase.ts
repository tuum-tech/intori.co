import { initializeApp } from 'firebase/app'
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck
} from 'firebase/app-check'
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export const firebaseApp = initializeApp(firebaseConfig)

export const authenticateRequestAnonymously = async () => {
  const auth = getAuth()
  await signInAnonymously(auth)
}

export const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaEnterpriseProvider(
    process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY!
  ),
  isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
})
