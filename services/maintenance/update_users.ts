import dayjs from 'dayjs'
import { getFirestore } from 'firebase-admin/firestore'

import { User } from '../types'

export const updateUser = async (userId: string): Promise<Partial<User> | undefined> => {
  try {
    const userDoc: User = (await getFirestore().collection('/discord').doc(userId).get()) as any
    const base: Partial<User> = {
      autoTranslate: true,
      lastTaskAt: userDoc.lastTaskAt || dayjs().toISOString(),
    }
    await getFirestore().collection('discord').doc(userId).update(base)
    return base
  } catch (err) {
    console.error('updateUser', err, userId)
    return undefined
  }
}

export const updateAllUsersNotif = async () => {
  try {
    const documents = await getFirestore().collection('/discord').get()
    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      if (doc.exists) {
        // eslint-disable-next-line no-console
        console.log('doc.id', doc.id)
        const res = await updateUser(doc.id)
        // eslint-disable-next-line no-console
        console.log('doc.id updated', doc.id, res)
      }
    }
    // eslint-disable-next-line no-console
    console.log('updateUser done')
  } catch (err) {
    console.error('getAllUsers', err)
    return []
  }
}
