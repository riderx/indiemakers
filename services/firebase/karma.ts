import dayjs from 'dayjs'
import { firestore } from 'firebase-admin'
import { Karma, KarmaAll } from '../types'

export const getKarmaById = async (id: string): Promise<KarmaAll> => {
  try {
    const documents = await firestore().collection(`discord/${id}/karma`).get()
    const karmas: Karma[] = []
    documents.docs.forEach((doc) => {
      const data = doc.data() as Karma
      if (data !== undefined) {
        karmas.push({ id: doc.id, ...(data as Karma) })
      }
    })
    const total = karmas.reduce((tt, current) => tt + current.value, 0)
    return { karmas, total }
  } catch (err) {
    console.error('getKarmaById', err)
    return { karmas: [], total: 0 }
  }
}

export const addKarmaById = async (
  userId: string,
  senderId: string,
  value: number
): Promise<KarmaAll> => {
  await firestore()
    .collection(`discord/${userId}/karma`)
    .add({ userId: senderId, value, createdAt: dayjs().toISOString() })
  const curKarma = await getKarmaById(userId)
  return curKarma
}
