/* eslint-disable import/first */
global.fetch = require('node-fetch')

const firebase = require('firebase-firestore-lite')
const util = require('../../plugins/feed')

const projectId = 'indiemakerfr'
// Now pass the auth instance as well as the projectId.
const db = new firebase.Database({ projectId })

const loadData = () => {
  return db
    .ref('people')
    .query()
    .orderBy('votes', 'desc')
    .orderBy('addDate', 'asc')
    .run()
    .then(async (results) => {
      const episodes = await util.feed()
      return results.map((data) => {
        const guid = findInEp(data.login, episodes)
        data.guid = guid
        data.img = `/api/maker?guid=${data.login}`
        return data
      })
    })
}

const findInEp = (name, episodes) => {
  let found = null
  episodes.forEach((element) => {
    if (element && element.twitter && element.twitter.name === name) {
      found = element.guid
    }
  })
  return found
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
