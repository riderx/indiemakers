const util = require('../../plugins/feed')
const func = require('../../plugins/firebase_func')

const postEp = async (element) => {
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
  const items = await util.feed()
  let elem = null
  if (req.query.guid === 'latest') {
    elem = items[0]
  } else {
    let guid = -1
    try {
      guid = Number(req.query.guid)
    } catch (error) {
      guid = req.query.guid
    }
    items.forEach((element, index) => {
      if (element.guid_fix === guid || guid === index) {
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
