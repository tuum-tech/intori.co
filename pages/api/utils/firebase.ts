import admin from 'firebase-admin'
import { getAuth, signInAnonymously } from "firebase/auth";

let firebaseAdmin: admin.app.App | undefined

const initiateAdmin = async () => {
  if (typeof window !== "undefined") {
    return undefined
  }

  if (firebaseAdmin) {
    return firebaseAdmin
  }

  const firebaseAdminConfig = {
    type: "service_account",
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || 'Missing FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };

  try {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig)
    }, 'admin')

    return firebaseAdmin
  } catch (err) {
    return admin.app()
  }
}

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// }

export const authenticateRequestAnonymously = async () => {
  const auth = getAuth()

  await signInAnonymously(auth)
}

export { initiateAdmin }
