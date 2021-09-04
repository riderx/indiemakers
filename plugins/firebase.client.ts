import Vue from 'vue'
import axios, { AxiosResponse } from 'axios'
import { Database } from 'firebase-firestore-lite'
// @ts-ignore
import Auth from 'firebase-auth-lite'
import { WarehouseStoreAPI } from 'vue-warehouse/types/warehouse'

const auth = new Auth({
  apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
  redirectUri: 'https://indiemakers.fr/login',
})
const zone = 'us-central1'
const projectId = 'indiemakerfr'
const url = `https://${zone}-${projectId}.cloudfunctions.net/`
// Now pass the auth instance as well as the projectId.
const db = new Database({ projectId, auth })

const func = async (name: string, data: {}) => {
  const headers: any = {}
  if (auth.user) {
    await auth.refreshIdToken() // Won't do anything if the token didn't expire yet.
    headers.Authorization = `Bearer ${auth.user.tokenManager.idToken}`
  }
  return axios.post(url + name, { data }, { headers })
}

const emailSigning = (email: string, url: string): any => {
  const authRedir = new Auth({
    apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
    redirectUri: url,
  })
  return authRedir.sendOobCode('EMAIL_SIGNIN', email)
}
interface CustomFire {
  // eslint-disable-next-line no-unused-vars
  auth: any
  db: Database
  // eslint-disable-next-line no-unused-vars
  func(key: string, data: object): Promise<AxiosResponse<any>>
  emailSigning: any
}

declare module '@nuxt/types' {
  interface Context {
    $warehouse: WarehouseStoreAPI
    $firebase: CustomFire
  }
}


declare module 'vue/types/vue' {
  interface Vue {
    $warehouse: WarehouseStoreAPI
    $firebase: CustomFire
  }
}

Vue.prototype.$firebase = { auth, db, func, emailSigning }

import { Plugin } from '@nuxt/types'


const myPlugin: Plugin = (context) => {
  context.$firebase = { auth, db, func, emailSigning }
}

export default myPlugin
