/* eslint-disable import/first */
global.fetch = require('node-fetch')

import { Database } from 'firebase-firestore-lite'
const util = require('../../plugins/feed')

const projectId = 'indiemakerfr'
// Now pass the auth instance as well as the projectId.
const db = new Database({ projectId })

const loadData = () => {
  return db
    .ref('people')
    .query()
    .orderBy('votes', 'desc')
    .orderBy('addDate', 'asc')
    .run()
    .then((results) => {
      return results.map(async (data) => {
        const found = await findInEp(data.login)
        data.guid = found.guid_fix
        data.img = `/api/maker?guid=${data.login}`
        return data
      })
    })
}

const findInEp = async (name) => {
  const episodes = await util.feed()
  let found = null
  episodes.forEach((element) => {
    if (element?.twitter?.name === name) {
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
