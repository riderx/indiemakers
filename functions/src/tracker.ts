import * as functions from 'firebase-functions'
import axios from 'axios'

// PixelMeApiToken
const configSecret = functions.config()

const PixelsId = configSecret.pixelme.pixels_id.split(',')
axios.defaults.baseURL = 'https://api.pixelme.me'
axios.defaults.headers.common.Authorization = `Bearer ${configSecret.pixelme.pixelsId}`


const bestKey = (url: string): string => {
  if (url.includes('twitter.com/hashtag/')) {
    return `H_${url.split('/').pop()}`
  }
  if (url.includes('twitter.com/')) {
    return url.split('/').pop() || url
  }
  if (url.includes('/') && url.indexOf('/') < (url.length - 1)) {
    return url.split('/').pop() || url
  }
  return url
}

export const shortURLPixel = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const key = bestKey(url)
    axios.post('/redirects', {
      url,
      key,
      pixels_ids: PixelsId,
      domain: 'imf.to'
    })
      .then((response) => {
        if (response && response.data && response.data.shorten) {
          console.log('new link', response.data)
          resolve(response.data.shorten)
        } else {
          console.error('shorten error, no shorten found', response)
          resolve(url)
        }
      })
      .catch((error) => {
        if (error.response.data.error_message === 'Key already taken for this domain') {
          resolve(`https://imf.to/${key}`)
        } else {
          console.error('shorten error', error.response.data, error)
          resolve(url)
        }
      })
  })
}
