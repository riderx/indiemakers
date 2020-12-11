const feed = require('../../plugins/feed')

module.exports = async (req, res) => {
  const items = await feed()
  let elem = null
  items.forEach((element) => {
    if (element.guid_fix === req.params.guid) {
      elem = element
    }
  })
  return res.json(elem)
}
