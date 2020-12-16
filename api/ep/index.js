/* eslint-disable import/first */
global.fetch = require('node-fetch')

const firebase = require('firebase-firestore-lite')

const util = require('../../plugins/feed')

const projectId = 'indiemakerfr'
// Now pass the auth instance as well as the projectId.
const db = new firebase.Database({ projectId })

const postEp = async (element) => {
  const ep = {
    udi: element.guid,
    title: element.title,
    preview: element.preview,
    image: element.image_optimized,
    content: element.content
  }
  if (element.instagram) {
    ep.instagram = element.instagram
  }
  if (element.twitter) {
    ep.twitter = element.twitter
  }
  try {
    await db.ref(`episodes/${element.guid}`).set(ep)
  } catch {
    return null
  }
}
module.exports = async (req, res) => {
  const items = await util.feed()
  let elem = null
  if (req.query.guid === 'latest') {
    elem = items[0]
  } else {
    items.forEach((element) => {
      if (element.guid_fix === req.query.guid) {
        elem = element
      }
    })
  }
  if (elem) {
    await util.sendImageToCache(elem.itunes.image, elem.guid_fix)
    await postEp(elem)
  }
  return res.json(elem)
}
