import axios from 'axios'
axios.defaults.baseURL = 'https://api.rebrandly.com/'

const config = {
  headers: {
    'Content-Type': 'application/json',
    apikey: process.env.rebrandlyKey || '',
    workspace: process.env.rebrandlyId || '',
  },
}
const destinations = ['http://youtube.com/c/BenjaminCode', 'https://twitter.com/Qovery_']
export const getLinks = (id: string | null = null): Promise<any[]> =>
  new Promise((resolve) => {
    axios
      .get(id ? `/v1/links?last=${id}` : '/v1/links', config)
      .then((response) => {
        if (response && response.data && response.data) {
          // console.error('new link', response.data)
          resolve(response.data)
        } else {
          console.error('shorten error, no shorten found', response)
          resolve(response.data)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  })
// destination: https://twitter.com/Qovery_
export const deleteLink = (id: string): Promise<any> =>
  new Promise((resolve) => {
    axios
      .delete(`/v1/links/${id}`, config)
      .then((response) => {
        if (response && response.data && response.data) {
          console.error('deleteLink', id)
          resolve(response.data)
        } else {
          console.error('shorten error, no shorten found', response)
          resolve(response.data)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  })

export const fixAllLink = async () => {
  let data = await getLinks()
  console.error('data', data.length)
  let tt = data.length
  while (tt) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      console.error(element.destination)
      if (
        destinations.includes(element.destination) ||
        element.destination.startsWith('http://imf.to/') ||
        element.destination.startsWith('http://hotspot.earth') ||
        element.destination.startsWith('https://indiehackers.com/product/apiflash') ||
        element.destination.startsWith('http://youtube.com/frenchguycooking') ||
        element.destination.startsWith('https://twitter.com/hashtag/')
      ) {
        await deleteLink(element.id)
      }
    }
    data = await getLinks(data[data.length - 1].id)
    console.error('data', data.length)
    tt = data.length
  }
}

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

export const shortURLPixel = (url: string): Promise<string> =>
  new Promise((resolve) => {
    const key = bestKey(url)
    axios
      .post(
        '/v1/links',
        {
          destination: url,
          domain: { fullName: 'imf.to' },
          slashtag: key,
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
        if (error.response.data.errors[0].code === 'AlreadyExists') {
          resolve(`https://imf.to/${key}`)
        } else {
          console.error('shorten error', error.response.data, error)
          resolve(url)
        }
      })
  })
