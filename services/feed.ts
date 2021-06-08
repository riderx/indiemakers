import dayjs from 'dayjs'
import Parser from 'rss-parser'
import ImageKit from 'imagekit'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
require('dayjs/locale/fr')

dayjs.locale('fr')
// const firestore = require('firebase-firestore-lite')

const rss = 'https://anchor.fm/s/414d1d4/podcast/rss'

const regexHtml = /(<([^>]+)>)/gi
const linkTwitterRe =
  /[sS]on.*[tT]witter.*:.*<a href="(?<link>.*?)">(?<name>.*?)<\/a>/i
const nameRe = /accueille (?<name>.*?)[.,]/i
const linkInstagramRe =
  /[sS]on [iI]nstagram.*:.*<a href="(?<link>.*?)">(?<name>.*?)<\/a>/i
const linkLinkedinRe =
  /[sS]on.*[lL]inkedin.*:.*<a href="(?<link>.*?)">(?<name>.*?)<\/a>/i
const parser = new Parser()
const imagekit = new ImageKit({
  publicKey: 'public_9vWOr643awJiLr6HqhpNNF1ZVkQ=',
  privateKey: String(process.env.IMAGEKIT_KEY),
  urlEndpoint: 'https://ik.imagekit.io/gyc0uxoln1/',
})

const guidConvert = (guid: string) => {
  if (guid && guid.indexOf('/') > 0) {
    return guid.split('/').slice(-1).pop()
  } else {
    return guid
  }
}

const cleanHandler = (handler: string) => {
  if (!handler) {
    return ''
  }
  return handler.replace('@', '').replace(regexHtml, '')
}
interface Social {
  name: string
  link: string
}
const findRegx = (regx: RegExp, text: string): Social => {
  const founds = regx.exec(text)
  if (!founds || !founds.groups) {
    return { name: '', link: '' }
  }
  return { name: cleanHandler(founds.groups.name), link: founds.groups.link }
}

export const sendImageToCache = async (url: string, guid: string) => {
  try {
    await imagekit.getFileDetails(guid)
  } catch (err) {
    try {
      await imagekit.upload({
        file: url, // required
        folder: 'indiemakers',
        fileName: guid, // required
        useUniqueFileName: false,
      })
    } catch (error) {
      console.error('sendImageToCache', error, url, guid)
    }
  }
}
const previewText = (text: string) => {
  const textSplited = text.split(' ')
  textSplited.length = 50
  return textSplited.join(' ').replace('.', '.<br/>')
}

const previewTextMeta = (text: string) => {
  const textSplited = text.split(' ')
  textSplited.length = 153
  return `${textSplited.join(' ').replace('.', '.<br/>')} ...`
}

const previewEmail = (text: string) => {
  const textSplited = text.split(' ')
  textSplited.length = 20
  return `${textSplited.join(' ')} ...`
}

const removeEmoji = (str: string) => {
  return str.replace(
    /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
    ''
  )
}
export const rawRss = () => parser.parseURL(rss)

export interface Episode {
  id: string
  udi: string
  guid: string
  image: string
  guidFix: string
  title: string
  content: string
  pubDate: string
  preview: string
  previewEmail: string
  previewNoEmoji: string
  date: dayjs.Dayjs
  twitter: Social
  name: Social
  instagram: Social
  linkedin: Social
  titleNoEmoji: string
  contentNoEmoji: string
  social: Social
  seoName: string
  imageOptimized: string
  imageBig: string
  imageLoading: string
  audio: string
}
export const feed = async () => {
  const items: Episode[] = []
  try {
    const parsed = await parser.parseURL(rss)
    if (parsed.items) {
      parsed.items.forEach((element: any, index: number) => {
        element.id = String(parsed.items.length - index)
        element.guidFix = guidConvert(element.guid)
        element.preview = previewText(element.contentSnippet)
        element.previewMeta = previewTextMeta(
          removeEmoji(element.contentSnippet)
        )
        element.previewEmail = previewEmail(element.contentSnippet)
        element.previewNoEmoji = removeEmoji(element.preview)
        element.date = dayjs(element.isoDate).fromNow()
        element.twitter = findRegx(linkTwitterRe, element.content)
        element.name = findRegx(nameRe, element.content)
        element.instagram = findRegx(linkInstagramRe, element.content)
        element.linkedin = findRegx(linkLinkedinRe, element.content)
        element.titleNoEmoji = removeEmoji(element.title)
        element.contentNoEmoji = removeEmoji(element.content)
        element.audio = element.enclosure.url
        if (element.twitter && element.twitter.name) {
          element.social = element.twitter
        } else if (element.instagram && element.instagram.name) {
          element.social = element.instagram
        } else if (element.linkedin && element.linkedin.name) {
          element.social = element.linkedin
        } else {
          element.social = { name: null, link: null }
        }
        const seoName = element.social.name
          ? element.social.name.replace('.', '-')
          : element.guidFix
        element.imageCloudinary = `v1621019061/indiemakers/${element.guid}/${seoName}?tr=h-300,w-300`
        element.imageIk = `https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/${element.guid}/${seoName}?tr=h-300,w-300`
        element.imageOptimized = `https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/${element.guid}/${seoName}?tr=h-300,w-300`
        element.imageBig = `https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/${element.guid}/${seoName}?tr=h-600,w-600`
        element.imageLoading = `https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/${element.guid}/${seoName}?tr=q-5,bl-5,h-300,w-300`
        items.push(element)
      })
    }
  } catch (err) {
    console.error('feed', err)
  }
  return items
}
