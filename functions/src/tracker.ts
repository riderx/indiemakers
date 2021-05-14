import * as functions from 'firebase-functions'
import axios from 'axios'
import findUrl from 'get-urls'
import { TwEntities, TwUrl } from './twitter'
const configSecret = functions.config()

const rebrandlyKey = configSecret.rebrandly.key
const rebrandlyId = configSecret.rebrandly.id
axios.defaults.baseURL = 'https://api.rebrandly.com/'
const findHashtags = require('find-hashtags')
const findMentions = require('mentions')

const bestKey = (url: string): string => {
  if (url.includes('twitter.com/hashtag/')) {
    return `H_${url.split('/').pop()}`
  }
  if (url.includes('twitter.com/')) {
    return url.split('/').pop() || url
  }
  if (url.includes('/') && url.indexOf('/') < url.length - 1) {
    return url.split('/').pop() || url
  }
  return url
}

const config = {
  headers: {
    'Content-Type': 'application/json',
    apikey: rebrandlyKey,
    workspace: rebrandlyId,
  },
}

export const shortURLPixel = (url: string): Promise<string> =>
  new Promise((resolve) => {
    const key = bestKey(url)
    axios
      .post(
        '/v1/links',
        {
          destination: url,
          domain: { fullName: 'imf.to' },
          // , slashtag: "A_NEW_SLASHTAG"
          // , title: "Rebrandly YouTube channel"
        },
        config
      )
      .then((response) => {
        if (response && response.data && response.data.shortUrl) {
          console.error('new link', response.data)
          resolve(response.data.shortUrl)
        } else {
          console.error('shorten error, no shorten found', response)
          resolve(url)
        }
      })
      .catch((error) => {
        if (
          error.response.data.error_message ===
          'Key already taken for this domain'
        ) {
          resolve(`https://imf.to/${key}`)
        } else {
          console.error('shorten error', error.response.data, error)
          resolve(url)
        }
      })
  })

export const findInTwUrls = (url: string, twUrls: TwUrl[]): string => {
  console.error('twUrls', twUrls)
  const found = twUrls.find((twUrl) => {
    if (twUrl.url === url) {
      return twUrl.expanded_url
    }
    return null
  })
  return found ? found.expanded_url : url
}

export const transformURLtoTracked = async (
  text: string,
  entities: TwEntities | null
) => {
  let newDescription = '' + text
  const links: string[] = Array.from(findUrl(text))
  const hashtags = findHashtags(text)
  const mentions = findMentions(text).get()
  for (const link of links) {
    let newHref = link
    try {
      if (!link.includes('https://imf.to/')) {
        if (entities) {
          const twUrl = findInTwUrls(link, entities.description.urls)
          newHref = await shortURLPixel(twUrl)
        } else {
          newHref = await shortURLPixel(link)
        }
      }
      newDescription = newDescription.split(link).join(newHref)
    } catch (err) {
      console.error('error transform link', link, err)
    }
  }
  for (const hashtag of hashtags) {
    const hHashtag = `#${hashtag}`
    let newHref = `https://twitter.com/hashtag/${hashtag}`
    try {
      newHref = await shortURLPixel(newHref)
    } catch (err) {
      console.error('error transform hashtag', hashtag, err)
    }
    newDescription = newDescription.split(hHashtag).join(newHref)
  }
  for (const mention of mentions) {
    const mMention = mention.substring(1)
    let newHref = `https://twitter.com/${mMention}`
    try {
      newHref = await shortURLPixel(newHref)
    } catch (err) {
      console.error('error transform mention', mention, err)
    }
    newDescription = newDescription.split(mention).join(newHref)
  }
  return newDescription
}
