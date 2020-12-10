const axios = require('axios')

const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.domain
export const feed = () => {
  return axios
    .get(`${domain}/${process.env.baseAPI}/feed`)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error(err)
      return []
    })
}

export const ep = (guid) => {
  return axios
    .get(`${domain}/${process.env.baseAPI}/ep/${guid}`)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error(err)
      return []
    })
}
