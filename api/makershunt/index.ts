import { Request, Response } from 'express'
import { firestore } from 'firebase-admin'
import { Episode } from '../../services/types'
import { feed } from '../../services/feed'
import fFnit from '../../services/firebase/init'

const findInEp = (name: string, episodes: Episode[]) => {
  let found = null
  const lowName = name.toLowerCase()
  for (let index = 0; index < episodes.length; index++) {
    const element = episodes[index]
    if (
      element &&
      element.twitter &&
      element.twitter.name &&
      element.twitter.name.toLowerCase() === lowName
    ) {
      found = element.guid
      break
    }
  }
  return found
}

const loadData = async () => {
  try {
    const episodes = await feed()
    const querySnapshot = await firestore()
      .collection('people')
      .orderBy('votes', 'desc')
      .orderBy('addDate', 'asc')
      .get()
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
const maker = async (_req: Request, res: Response) => {
  try {
    fFnit()
    const data = await loadData()
    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.json([])
  }
}
export default maker
