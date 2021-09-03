import * as dotenv from 'dotenv'
import fFnit from '../firebase/init'
import { podcastToFirebase } from '../firebase/podcasts'
dotenv.config()
// import { initTranslate, frToEn } from '../discord/translate'
// import { fixAllLink } from './fix_shorter'
// import { fixAllUsers } from './fix_useraccount'
// import { updateAllUsersNotif } from './update_users'
// eslint-disable-next-line no-console
console.log('init Firebase')
fFnit()
// eslint-disable-next-line no-console
console.log('init Firebase done')
// updateAllUsersNotif()
// fixAllUsers()
// fixAllLink()
// initTranslate()
// frToEn('bonjour, ceci est un message')
try {
  podcastToFirebase() // add podcast to firebase
} catch (e) {
  console.error(e)
}
