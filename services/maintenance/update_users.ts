import dayjs from 'dayjs'
import admin from 'firebase-admin'
import { User } from '../discord/bot/user'

export const updateUser = async (
  userId: string
): Promise<Partial<User> | undefined> => {
  try {
    const userDoc: User = (await admin
      .firestore()
      .collection('/discord')
      .doc(userId)
      .get()) as any
    const base: Partial<User> = {
      autoTranslate: true,
      lastTaskAt: userDoc.lastTaskAt || dayjs().toISOString(),
    }
    await admin.firestore().collection('discord').doc(userId).update(base)
    return base
  } catch (err) {
    console.error('updateUser', err, userId)
    return undefined
  }
}

export const updateAllUsersNotif = async () => {
  try {
    const documents = await admin.firestore().collection('/discord').get()
    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      if (doc.exists) {
        console.log('doc.id', doc.id)
        const res = await updateUser(doc.id)
        console.log('doc.id updated', doc.id, res)
      }
    }
    console.log('updateUser done')
  } catch (err) {
    console.error('getAllUsers', err)
    return []
  }
}
