import { getFirestore } from 'firebase-admin/firestore'
import { Episode } from '../types'

export const getOnePodcastById = async (id: string): Promise<Episode | null> => {
  try {
    const Ep = await getFirestore().collection('/podcasts').doc(id).get()
    if (Ep.exists) {
      const data = Ep.data() as Episode
      return data
    }
    return null
  } catch (err) {
    console.error('getOnePodcastById', id, err)
    return null
  }
}

export const getAllPodcast = async (): Promise<Episode[]> => {
  try {
    const documents = await getFirestore().collection('/podcasts').orderBy('pubDate', 'desc').get()
    const eps: Episode[] = []
    documents.docs.forEach((doc) => {
      const data: Episode = doc.data() as Episode
      if (data !== undefined) {
        eps.push(data)
      }
    })
    return eps
  } catch (err) {
    console.error('getAllPodcast', err)
    return []
  }
}
