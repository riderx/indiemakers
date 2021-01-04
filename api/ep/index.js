const util = require('../../plugins/feed')
const func = require('../../plugins/firebase_func')

const postEp = async (element) => {
  const ep = {
    udi: element.guid_fix,
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
    await func.run('addEp', ep)
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
