const util = require('../plugins/feed')

module.exports = async (req, res) => {
  return res.json(await util.feed())
}
