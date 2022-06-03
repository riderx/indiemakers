import ImageKit from 'imagekit'
import { getFirestore } from 'firebase-admin/firestore'
import Parser from 'rss-parser'
import slug from 'elegant-slug'


const rss = 'https://anchor.fm/s/414d1d4/podcast/rss'
const ikBase = 'https://ik.imagekit.io/gyc0uxoln1/ik-seo/indiemakers/'

const regexHtml = /(<([^>]+)>)/gi
const linkTwitterRe = /[sS]on.*[tT]witter.*:.*<a.*href="(?<link>.*?)".*>(?<name>.*?)<\/a>/i
const nameRe = /accueille (?<name>.*?)[.,]/i
const linkInstagramRe = /[sS]on [iI]nstagram.*:.*<a.*href="(?<link>.*?)".*>(?<name>.*?)<\/a>/i
const linkLinkedinRe = /[sS]on.*[lL]inkedin.*:.*<a.*href="(?<link>.*?)".*>(?<name>.*?)<\/a>/i
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

export interface Social {
  name: string
  link: string
}

export interface Episode {
  id: string
  guid: string
  title: string
  content: string
  pubDate: string
  name: string
  twitter: Social
  instagram: Social
  linkedin: Social
  social: Social
  preview?: string
  date?: string
  seoName: string
  image: string
  imageOptimized: string
  imageBig: string
  imageLoading: string
  audio: string
}

export const sendImageToCache = async (url: string, guid: string) => {
  try {
    const imagekit = new ImageKit({
      urlEndpoint: 'https://ik.imagekit.io/gyc0uxoln1',
      publicKey: 'public_9vWOr643awJiLr6HqhpNNF1ZVkQ=',
      privateKey: String(process.env.IMAGEKIT_KEY),
    })
    await imagekit.upload({
      file: url, // required
      folder: 'indiemakers',
      fileName: `ep_${guid}`, // required
      useUniqueFileName: false,
    })
    return Promise.resolve()
  } catch (error) {
    console.error('sendImageToCache', error, url, guid)
    return Promise.reject(error)
  }
}


const postEp = async (element: Episode): Promise<void> => {
  try {
    await getFirestore().collection('podcasts').doc(element.id).update(element)
    return Promise.resolve()
  } catch {
    try {
      await getFirestore().collection('podcasts').doc(element.id).set(element)
      return Promise.resolve()
    } catch (err) {
      console.error('postEp', err)
      return Promise.reject(err)
    }
  }
}

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

export const podcastToFirebase = async () => {
  try {
    const epList = await feed()
    // declare pormise list
    const pList: Promise<unknown>[] = []
    // loop through episodes
    epList.forEach((element: Episode) => {
      // push promise to list
      pList.push(sendImageToCache(element.image, element.id))
      pList.push(postEp(element))
    })
    return Promise.all(pList)
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}
