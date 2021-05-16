import admin from 'firebase-admin'

export default () => {
  if (!admin.apps.length) {
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
      admin.initializeApp({
        credential: admin.credential.cert(
          JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
        ),
        databaseURL: process.env.FIREBASE_DATABASE,
      })
    } else {
      admin.initializeApp()
    }
  } else {
    admin.app() // if already initialized, use that one
  }
}
