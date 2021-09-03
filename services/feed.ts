import Parser from 'rss-parser'
import emojiRegex from 'emoji-regex/RGI_Emoji'
import slug from 'elegant-slug'
import { Episode, Social } from './types'

// const firestore = require('firebase-firestore-lite')

const rss = 'https://anchor.fm/s/414d1d4/podcast/rss'
const ikBase = 'https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/'

const regexHtml = /(<([^>]+)>)/gi
const linkTwitterRe =
  /[sS]on.*[tT]witter.*:.*<a.*href="(?<link>.*?)".*>(?<name>.*?)<\/a>/i
const nameRe = /accueille (?<name>.*?)[.,]/i
const linkInstagramRe =
  /[sS]on [iI]nstagram.*:.*<a.*href="(?<link>.*?)".*>(?<name>.*?)<\/a>/i
const linkLinkedinRe =
  /[sS]on.*[lL]inkedin.*:.*<a.*href="(?<link>.*?)".*>(?<name>.*?)<\/a>/i
const parser = new Parser()

const cleanHandler = (handler: string) => {
  if (!handler) {
    return ''
  }
  return handler.replace('@', '').replace(regexHtml, '')
}

const findRegx = (regx: RegExp, text: string): Social => {
  const founds = regx.exec(text)
  if (!founds || !founds.groups) {
    return { name: '', link: '' }
  }
  return { name: cleanHandler(founds.groups.name), link: founds.groups.link }
}

export const cutText = (text: string, length: number = 50) => {
  if (!text) return ' ...'
  const textSplited = text.split(' ')
  textSplited.length = length
  return `${textSplited.join(' ').replace('.', '.<br/>')} ...`
}

export const removeEmoji = (str: string): string => {
  return str ? str.replace(emojiRegex(), '') : ''
}

export const rawRss = () => parser.parseURL(rss)

export const feed = async () => {
  const items: Episode[] = []
  try {
    const parsed = await parser.parseURL(rss)
    if (parsed.items) {
      parsed.items.forEach((element: any, index: number) => {
        const id = String(parsed.items.length - index)
        const name = findRegx(nameRe, element.content).name
        const ep: Episode = {
          guid: element.guid,
          title: element.title,
          content: element.content,
          pubDate: element.isoDate,
          id,
          name,
          twitter: findRegx(linkTwitterRe, element.content),
          instagram: findRegx(linkInstagramRe, element.content),
          linkedin: findRegx(linkLinkedinRe, element.content),
          audio: element.enclosure.url,
          seoName: '',
          social: { name: '', link: '' },
          image: element.itunes.image,
          imageOptimized: `${ikBase}ep_${id}?tr=h-300,w-300`,
          imageBig: `${ikBase}ep_${id}?tr=h-600,w-600`,
          imageLoading: `${ikBase}ep_${id}?tr=q-5,bl-5,h-300,w-300`,
        }
        if (ep.twitter && ep.twitter.name) {
          ep.social = ep.twitter
        } else if (ep.instagram && ep.instagram.name) {
          ep.social = ep.instagram
        } else if (ep.linkedin && ep.linkedin.name) {
          ep.social = ep.linkedin
        }
        ep.seoName = name ? slug(name) : id
        ep.imageOptimized = `${ikBase}ep_${ep.id}/${ep.seoName}?tr=h-300,w-300`
        ep.imageBig = `${ikBase}ep_${ep.id}/${ep.seoName}?tr=h-600,w-600`
        ep.imageLoading = `${ikBase}ep_${ep.id}/${ep.seoName}?tr=q-5,bl-5,h-300,w-300`
        items.push(ep)
      })
    }
  } catch (err) {
    console.error('feed', err)
  }
  return items
}
