const axios = require('axios')

export const domain = (VERCEL_URL, DOMAIN) => {
  return VERCEL_URL ? `https://${VERCEL_URL}` : DOMAIN
}

export const makers = ($config) => {
  return axios
    .get(`${domain($config.VERCEL_URL, $config.DOMAIN)}/${$config.BASEAPI}/makers`)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error(err)
      return []
    })
}

export const feed = ($config) => {
  return axios
    .get(`${domain($config.VERCEL_URL, $config.DOMAIN)}/${$config.BASEAPI}/feed`)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error(err)
      return []
    })
}

export const ep = (guid, $config) => {
  return axios
    .get(`${domain($config.VERCEL_URL, $config.DOMAIN)}/${$config.BASEAPI}/ep?guid=${guid}`)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error(err)
      return []
    })
}
