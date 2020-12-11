import { feed } from '../plugins/feed'

module.exports = async (req, res) => {
  return res.json(await feed())
}
