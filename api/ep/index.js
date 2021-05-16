
const postEp = async (element) => {
  const func = require('../../plugins/firebase_func')
  const ep = {
    udi: element.guid_fix,
    title: element.title_no_emoji,
    preview: element.preview_email,
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
  const util = require('../../plugins/feed')
  const items = await util.feed()
  let elem = null
  if (req.query.guid === 'latest') {
    elem = items[0]
  } else {
    for (let index = 0; index < items.length; index++) {
      const element = items[index]
      if (element.guid_fix === req.query.guid || element.id === req.query.guid) {
        elem = element
        break
      }
    }
  }
  res.json(elem)
  if (elem) {
    await util.sendImageToCache(elem.itunes.image, elem.guid_fix)
    await postEp(elem)
  }
}