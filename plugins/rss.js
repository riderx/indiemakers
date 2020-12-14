const axios = require('axios')

export const domain = (VERCEL_URL, DOMAIN) => {
  return VERCEL_URL ? `https://${VERCEL_URL}` : DOMAIN
}

export const makers = ($config) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${$config.BASEAPI}/makers`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error('makers err', err)
      return []
    })
}

export const feed = ($config) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${$config.BASEAPI}/feed`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error('feed err', err)
      return []
    })
}

export const ep = (guid, $config) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${$config.BASEAPI}/ep?guid=${guid}`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error('ep err', err)
      return []
    })
}
