import { personalModayReminder, personalTaskReminder, personalFridayTaskReminder, personalVocalReminder } from './../discord/bot/schedule';
// import { lateBot, morningBot } from './../discord/bot/schedule';
import * as dotenv from 'dotenv'
import { onboardingMessage } from '../discord/bot/utils'
import { getUsersById } from '../firebase/discord'
import fFnit from '../firebase/init'
import { initTranslate } from '../discord/translate';
// import { podcastToFirebase } from '../firebase/podcasts'
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
// get user from discord id
const testOnboarding = async() => {
  const user = await getUsersById('309008240274964480')
  if (user) {
    // await onboardingMessage(user)
    await personalModayReminder([user])
    await personalTaskReminder([user])
    // await personalFridayTaskReminder([user])
    await personalVocalReminder([user])
  }
}
// initTranslate()
testOnboarding()
// morningBot()
// await lateBot()
// fixAllLink()
// initTranslate()
// frToEn('bonjour, ceci est un message')
// try {
//   podcastToFirebase() // add podcast to firebase
// } catch (e) {
//   console.error(e)
// }
