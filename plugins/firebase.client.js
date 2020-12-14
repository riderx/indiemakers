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

const func = (name, data) => {
  return axios.get(url + name, data, { headers: auth.authorizedRequest })
}
const emailSigning = (email, url) => {
  const authRedir = new Auth({
    apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
    redirectUri: url
  })
  return authRedir.sendOobCode('EMAIL_SIGNIN', email)
}

Vue.prototype.$firebase = { auth, db, func, emailSigning }
