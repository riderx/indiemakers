import admin from 'firebase-admin'
if (!admin.apps.length) {
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    admin.initializeApp(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT))
  } else {
    admin.initializeApp()
  }
} else {
  admin.app() // if already initialized, use that one
}

export default { ...admin }
