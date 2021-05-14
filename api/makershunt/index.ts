import { Request, Response } from 'express'
import { Episode, feed } from '../../services/feed'
import { run } from '../../services/firebase_func'

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
    const results = await run('getMakers')
    if (results) {
      const episodes = await feed()
      return results.map((data: any) => {
        if (data.login) {
          data.guid = findInEp(data.login, episodes)
        }
        data.img = data.pic
        return data
      })
    } else {
      return []
    }
  } catch (err) {
    console.error('loadData', err)
    return []
  }
}
const maker = async (_req: Request, res: Response) => {
  try {
    const data = await loadData()
    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.json([])
  }
}
export default maker
