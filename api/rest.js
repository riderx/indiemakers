const bodyParser = require('body-parser')
const app = require('express')()
const axios = require('axios')
const cheerio = require('cheerio')
const Parser = require('rss-parser')
const ImageKit = require('imagekit')
const ExpressCache = require('express-cache-middleware')
const cacheManager = require('cache-manager')
const redisStore = require('cache-manager-redis')
const parser = new Parser()
const rss = 'https://anchor.fm/s/414d1d4/podcast/rss'
const linkTwitterRe = /Son Twitter : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkInstagramRe = /Son Instagram : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkLinkedinRe = /Son Linkedin : <a href="(?<link>.*)">(?<name>.*)<\/a>/g

// "access_token_secret": "QaDol7JdpVMzTqEDyiykbhMMM38x2a5IUKFMsZ6Fo0dhs",
// "consumer_key": "FlAWfz12qce6flIK3DfSBOqIp",
// "consumer_secret": "rJEhGGvkQQ21mEPJ9K0yIdHE9ux2jUqAS2SZz7OS67HrmdkapF",
// "access_token_key": "365398423-jfcTlZs6thokCSgeqBNdHHoKrl0hF9JrMt5i7q0l"

const redisCache = cacheManager.caching({
  store: redisStore,
  host: 'redis-16500.c239.us-east-1-2.ec2.cloud.redislabs.com',
  port: 16500,
  auth_pass: 'pazbYDibG2EO1WMIbgzU5HV8MYSogbtP',
  db: 0,
  ttl: 3600
})

const cacheMiddleware = new ExpressCache(redisCache)
const imagekit = new ImageKit({
  publicKey: 'public_9vWOr643awJiLr6HqhpNNF1ZVkQ=',
  privateKey: 'private_fnm/B2spgFy+0xqXGz6C3+eSW00=',
  urlEndpoint: 'https://ik.imagekit.io/gyc0uxoln1/'
})

const guidConvert = (guid) => {
  if (guid && guid.indexOf('/') > 0) {
    return guid.split('/').slice(-1).pop()
  } else {
    return guid
  }
}

const findTw = (text) => {
  const founds = linkTwitterRe.exec(text)
  if (!founds || !founds.groups) {
    return { name: null, link: null }
  }
  return founds.groups
}

const findLinkedin = (text) => {
  const founds = linkLinkedinRe.exec(text)
  if (!founds || !founds.groups) {
    return { name: null, link: null }
  }
  return founds.groups
}

const findInst = (text) => {
  const founds = linkInstagramRe.exec(text)
  if (!founds || !founds.groups) {
    return { name: null, link: null }
  }
  return founds.groups
}

const sendImageToCache = async (url, guid) => {
  try {
    await imagekit.getFileDetails(guid)
  } catch (err) {
    try {
      await imagekit.upload({
        file: url, // required
        folder: 'indiemakers',
        fileName: guid, // required
        useUniqueFileName: false
      })
    } catch (error) {
      console.error('sendImageToCache', error)
    }
  }
}
const previewText = (text) => {
  let first = text.split(/[.!]+/)[0]
  if (first.split(' ').length > 30) {
    first = `${first.split(' ').splice(0, 17).join(' ')} ...`
  }
  return first
}

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

const removeEmoji = (str) => {
  return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
}

const feed = async () => {
  const items = []
  try {
    const parsed = await parser.parseURL(rss)
    if (parsed.items) {
      parsed.items.forEach(async (element) => {
        element.guid_fix = guidConvert(element.guid)
        element.preview = previewText(element.contentSnippet)
        element.preview_no_emoji = removeEmoji(element.preview)
        element.twitter = findTw(element.content)
        element.insta = findInst(element.content)
        element.linkedin = findLinkedin(element.content)
        element.title_no_emoji = removeEmoji(element.title)
        element.content_no_emoji = removeEmoji(element.content)
        if (element.twitter && element.twitter.name) {
          element.social = element.twitter
        } else if (element.insta && element.insta.name) {
          element.social = element.insta
        } else if (element.linkedin && element.linkedin.name) {
          element.social = element.linkedin
        }
        items.push(element)
        element.image_optimized = `https://ik.imagekit.io/gyc0uxoln1/indiemakers/${element.guid_fix}?tr=h-300,w-300`
        element.image_big = `https://ik.imagekit.io/gyc0uxoln1/indiemakers/${element.guid_fix}?tr=h-600,w-600`
        element.image_loading = `https://ik.imagekit.io/gyc0uxoln1/indiemakers/${element.guid_fix}?tr=bl-6`
        await sendImageToCache(element.itunes.image, element.guid_fix)
      })
    }
  } catch (err) {
    console.error('parsed', err)
  }
  return items
}

// cacheMiddleware.attach(app)
app.use(bodyParser.json())
app.all('/feed', async (req, res) => {
  res.json(await feed())
})
app.all('/makers/:guid', async (req, res) => {
  const url = await getTwitter(req.params.guid, '_200x200')
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
})
app.all('/ep/:guid', async (req, res) => {
  const items = await feed()
  let elem = null
  items.some((element) => {
    if (element.guid_fix === req.params.guid) {
      elem = element
      // return res.json(element)
    }
  })
  return res.json(elem)
})

module.exports = app
