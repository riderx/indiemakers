import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app'

export default () => {
  const runtimeConfig = useRuntimeConfig()
  if (!getApps().length) {
    if (runtimeConfig.googleServiceAccount) {
      initializeApp({
        credential: cert(JSON.parse(runtimeConfig.googleServiceAccount)),
        databaseURL: runtimeConfig.firebaseDatabase,
      })
    } else {
      initializeApp()
    }
  } else {
    getApp() // if already initialized, use that one
  }
}
