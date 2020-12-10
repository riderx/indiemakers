const axios = require('axios')

const domain = `${window.location.protocol}//${window.location.host}`
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
