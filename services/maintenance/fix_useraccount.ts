// import admin from 'firebase-admin'
// import dayjs from 'dayjs'
// import fFnit from '../../services/firebase_init'
// import { User } from './bot/user'
// import { getUserData } from './bot/utils'

// export const updateUser = async (userId: string): Promise<User | undefined> => {
//   try {
//     const userDoc: any = await admin
//       .firestore()
//       .collection('/discord')
//       .doc(userId)
//       .get()
//     if (userDoc && userDoc.userId && userDoc.userId !== '') {
//       return userDoc
//     }
//     const userInfo = await getUserData(userId)
//     const base: User = {
//       userId,
//       avatar: '',
//       avatarUrl: '',
//       streak: 0,
//       bestStreak: 0,
//       taskReminder: 'true',
//       onboardingSend: false,
//       mondayReminder: 'false',
//       voiceReminder: 'false',
//       incomes: 0,
//       karma: 0,
//       projects: 0,
//       tasks: 0,
//       username: '',
//       createdAt: dayjs().toISOString(),
//       updatedAt: dayjs().toISOString(),
//     }
//     if (userInfo) {
//       if (userInfo.avatar) {
//         base.avatar = userInfo.avatar
//         base.avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.png`
//       } else {
//         base.avatarUrl =
//           'https://res.cloudinary.com/forgr/image/upload/v1621079734/indiemakers/cover-im_no_gjzhog.jpg'
//       }
//       base.username = userInfo.username
//     }
//     await admin.firestore().collection('discord').doc(userId).update(base)
//     return base
//   } catch (err) {
//     console.error('updateUser', err, userId)
//     return undefined
//   }
// }

// export const fixAllUsers = async () => {
//   try {
//     fFnit()
//     const documents = await admin.firestore().collection('/discord').get()
//     for (let index = 0; index < documents.docs.length; index++) {
//       const doc = documents.docs[index]
//       if (doc.exists) {
//         console.log('doc.id', doc.id)
//         const res = await updateUser(doc.id)
//         console.log('doc.id updated', doc.id, res)
//       }
//     }
//     console.log('updateUser done')
//   } catch (err) {
//     console.error('getAllUsers', err)
//     return []
//   }
// }
