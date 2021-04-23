const findInEp = (name, episodes) => {
  let found = null
  const lowName = name.toLowerCase()
  for (let index = 0; index < episodes.length; index++) {
    const element = episodes[index]
    if (element && element.twitter && element.twitter.name && element.twitter.name.toLowerCase() === lowName) {
      found = element.guid
      break
    }
  }
  return found
}

const loadData = async () => {
  const util = require('../../plugins/feed')
  const func = require('../../plugins/firebase_func')
  try {
    const results = await func.run('getMakers')
    if (results) {
      const episodes = await util.feed()
      return results.map((data) => {
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

module.exports = async (req, res) => {
  try {
    const data = await loadData()
    return res.json(data)
  } catch (err) {
    console.log(err)
    return res.json([])
  }
}
