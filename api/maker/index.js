
const axios = require('axios')
const cheerio = require('cheerio')

const getTwitter = (username, size) => {
  const url = `https://mobile.twitter.com/${username}`
  return new Promise((resolve) => {
    axios
      .get(url)
      .then((response) => {
        const html = cheerio.load(response.data)
        const url = (html('.avatar img').attr('src') || '').replace(
          '_normal',
          size
        )
        return resolve(url)
      }).catch((err) => {
        console.error(err)
        return resolve('')
      })
  })
}

module.exports = async (req, res) => {
  const url = await getTwitter(req.query.guid, '_200x200')
  let data = ''
  const headers = { 'Content-Type': 'image/jpeg' }
  res.writeHead(200, headers)
  try {
    const response = await axios({
      method: 'get',
      responseType: 'arraybuffer',
      url
    })
    data = response.data
  } catch (err) {
    console.error(err)
  }
  return res.end(data, 'binary')
}
