import { getFirestore } from 'firebase-admin/firestore'
import { Episode } from '~~/services/types'
import initF from '~~/services/firebase/init'
import { getAllPodcast } from '~~/services/firebase/podcasts'

const findInEp = (name: string, episodes: Episode[]) => {
  let found = null
  const lowName = name.toLowerCase()
  for (let index = 0; index < episodes.length; index++) {
    const element = episodes[index]
    if (element && element.twitter && element.twitter.name && element.twitter.name.toLowerCase() === lowName) {
      found = element.guid
      break
    }
  }
  return found
}

const loadData = async () => {
  try {
    const episodes = await getAllPodcast()

    const querySnapshot = await getFirestore().collection('people').orderBy('votes', 'desc').orderBy('addDate', 'asc').get()
    return querySnapshot.docs.map((doc: any) => {
      if (doc.login) {
        doc.guid = findInEp(doc.login, episodes)
      }
      doc.img = doc.pic
      return Object.assign(doc.data(), { id: doc.id })
    })
  } catch (err) {
    console.error('loadData', err)
    return []
  }
}
export default defineEventHandler(async () => {
  try {
    initF()
    const data = await loadData()
    return data
  } catch (err) {
    console.error(err)
    return []
  }
})
