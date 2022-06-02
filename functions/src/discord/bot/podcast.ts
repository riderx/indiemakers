import { getFirestore } from 'firebase-admin/firestore'
import { feed } from './feed'
import { sendImageToCache } from './imageCache'
import { Episode } from './types'

const postEp = async (element: Episode): Promise<void> => {
  try {
    await getFirestore().collection('podcasts').doc(element.id).update(element)
    return Promise.resolve()
  } catch {
    try {
      await getFirestore().collection('podcasts').doc(element.id).set(element)
      return Promise.resolve()
    } catch (err) {
      console.error('postEp', err)
      return Promise.reject(err)
    }
  }
}

export const podcastToFirebase = async () => {
  try {
    const epList = await feed()
    // declare pormise list
    const pList: Promise<unknown>[] = []
    // loop through episodes
    epList.forEach((element: Episode) => {
      // push promise to list
      pList.push(sendImageToCache(element.image, element.id))
      pList.push(postEp(element))
    })
    return Promise.all(pList)
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}

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
