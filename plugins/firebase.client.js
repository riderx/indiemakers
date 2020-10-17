import Vue from 'vue'

import firebase from 'firebase/app'
import 'firebase/firestore/memory'
import 'firebase/auth'
import 'firebase/functions'

// Get a Firestore instance
const config = {
  apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
  authDomain: 'indiemakerfr.firebaseapp.com',
  databaseURL: 'https://indiemakerfr.firebaseio.com',
  projectId: 'indiemakerfr',
  storageBucket: 'indiemakerfr.appspot.com',
  messagingSenderId: '600956995728',
  appId: '1:600956995728:web:17aacb03e66648e2d63015'
}

firebase
  .initializeApp(config)
  .firestore()
Vue.prototype.$firebase = firebase
