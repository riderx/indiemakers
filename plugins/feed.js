const Parser = require('rss-parser')
const ImageKit = require('imagekit')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
require('dayjs/locale/fr')

dayjs.locale('fr')
// const firestore = require('firebase-firestore-lite')

const rss = 'https://anchor.fm/s/414d1d4/podcast/rss'
const linkTwitterRe = /son twitter : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkInstagramRe = /son instagram : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkLinkedinRe = /son linkedin : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const parser = new Parser()
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

const cleanHandler = (handler) => {
  if (!handler) { return null }
  return handler.replace('@', '')
}

const findTw = (text) => {
  const founds = linkTwitterRe.exec(text.toLowerCase())
  if (!founds || !founds.groups) {
    return { name: null, link: null }
  }
  founds.groups.name = cleanHandler(founds.groups.name)
  return founds.groups
}

const findLinkedin = (text) => {
  const founds = linkLinkedinRe.exec(text.toLowerCase())
  if (!founds || !founds.groups) {
    return { name: null, link: null }
  }
  founds.groups.name = cleanHandler(founds.groups.name)
  return founds.groups
}

const findInst = (text) => {
  const founds = linkInstagramRe.exec(text.toLowerCase())
  if (!founds || !founds.groups) {
    return { name: null, link: null }
  }
  founds.groups.name = cleanHandler(founds.groups.name)
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

const removeEmoji = (str) => {
  return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
}
const feed = async () => {
  const items = []
  try {
    const parsed = await parser.parseURL(rss)
    if (parsed.items) {
      parsed.items.forEach((element) => {
        element.guid_fix = guidConvert(element.guid)
        element.preview = previewText(element.contentSnippet)
        element.preview_no_emoji = removeEmoji(element.preview)
        element.twitter = findTw(element.content)
        element.date = dayjs(element.isoDate).fromNow()
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
        } else {
          element.social = { name: null, link: null }
        }
        items.push(element)
        console.log('element.twitter.name', element.guid_fix, element.social.name, element.social.link)

        // ik-seo/${element.guid_fix}/${element.social.name}
        const seoName = element.social.name ? element.social.name.replace('.', '-') : element.guid_fix
        element.image_optimized = `https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/${element.guid_fix}/${seoName}?tr=h-300,w-300`
        element.image_big = `https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/${element.guid_fix}/${seoName}?tr=h-600,w-600`
        element.image_loading = `https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/${element.guid_fix}/${seoName}?tr=q-5,bl-5,h-150,w-150`
      })
    }
  } catch (err) {
    console.error('feed', err)
  }
  return items
}

module.exports = {
  sendImageToCache,
  feed
}
