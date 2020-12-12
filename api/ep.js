const util = require('../plugins/feed')

module.exports = async (req, res) => {
  const items = await util.feed()
  let elem = null
  items.forEach((element) => {
    if (element.guid_fix === req.query.guid) {
      elem = element
    }
  })
  if (elem) {
    await util.sendImageToCache(elem.itunes.image, elem.guid_fix)
    await util.postEp(elem)
  }
  return res.json(elem)
}
