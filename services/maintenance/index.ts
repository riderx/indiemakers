import * as dotenv from 'dotenv'
import { initTranslate, frToEn } from '../discord/translate'
import fFnit from '../firebase_init'
// import { fixAllLink } from './fix_shorter'
// import { fixAllUsers } from './fix_useraccount'
// import { updateAllUsersNotif } from './update_users'
// eslint-disable-next-line no-console
console.log('init Firebase')
dotenv.config()
fFnit()
// updateAllUsersNotif()
// fixAllUsers()
// fixAllLink()
initTranslate()
frToEn('bonjour, ceci est un message')
