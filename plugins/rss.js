const axios = require('axios')

export const feed = () => {
  return axios
    .get(`${process.env.domain}/${process.env.baseAPI}/feed`)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error(err)
      return []
    })
}

export const ep = (guid) => {
  return axios
    .get(`${process.env.domain}/${process.env.baseAPI}/ep/${guid}`)
    .then((response) => {
      return response.data
    }).catch((err) => {
      console.error(err)
      return []
    })
}
