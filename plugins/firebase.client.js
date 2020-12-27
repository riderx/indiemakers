import Vue from 'vue'
import axios from 'axios'

import { Database } from 'firebase-firestore-lite'

import Auth from 'firebase-auth-lite'

const auth = new Auth({
  apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
  redirectUri: 'https://indiemakers.fr/login'
})
const zone = 'us-central1'
const projectId = 'indiemakerfr'
const url = `https://${zone}-${projectId}.cloudfunctions.net/`
// Now pass the auth instance as well as the projectId.
const db = new Database({ projectId, auth })

const func = async (name, data) => {
  const headers = {}
  if (auth.user) {
    await auth.refreshIdToken() // Won't do anything if the token didn't expire yet.
    headers.Authorization = `Bearer ${auth.user.tokenManager.idToken}`
  }
  return axios.post(url + name, data, { headers })
}
const emailSigning = (email, url) => {
  const authRedir = new Auth({
    apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
    redirectUri: url
  })
  return authRedir.sendOobCode('EMAIL_SIGNIN', email)
}

Vue.prototype.$firebase = { auth, db, func, emailSigning }
