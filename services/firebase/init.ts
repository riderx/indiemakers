import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app'

export default () => {
  if (!getApps().length) {
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
      initializeApp({
        credential: cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)),
        databaseURL: process.env.FIREBASE_DATABASE,
      })
    } else {
      initializeApp()
    }
  } else {
    getApp() // if already initialized, use that one
  }
}
