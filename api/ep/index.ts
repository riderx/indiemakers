import { Request, Response } from 'express'
import { Episode } from '../../services/feed'

const postEp = async (element: Episode) => {
  const func = require('../../services/firebase_func')
  const ep: Partial<Episode> = {
    udi: element.guidFix,
    title: element.titleNoEmoji,
    preview: element.previewEmail,
    image: element.imageOptimized,
    content: element.content,
  }
  if (element.instagram) {
    ep.instagram = element.instagram
  }
  if (element.twitter) {
    ep.twitter = element.twitter
  }
  try {
    await func.run('addEp', ep)
  } catch {
    return null
  }
}

const ep = async (req: Request, res: Response) => {
  const util = require('../../services/feed')
  const items = await util.feed()
  let elem = null
  if (req.query.guid === 'latest') {
    elem = items[0]
  } else {
    for (let index = 0; index < items.length; index++) {
      const element: Episode = items[index]
      if (element.guidFix === req.query.guid || element.id === req.query.guid) {
        elem = element
        break
      }
    }
  }
  res.json(elem)
  if (elem) {
    await util.sendImageToCache(elem.itunes.image, elem.guid)
    await postEp(elem)
  }
}
export default ep
