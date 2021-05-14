import axios from 'axios'
import { NuxtConfig } from '@nuxt/types'
export const domain = (VERCEL_URL: string, DOMAIN: string) => {
  return VERCEL_URL ? `https://${VERCEL_URL}` : DOMAIN
}

export const discordMakers = ($config: NuxtConfig) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${
    $config.BASEAPI
  }/community`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('makers err', err)
      return []
    })
}

export const discordProjectId = (
  $config: NuxtConfig,
  userId: string,
  id: string
) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${
    $config.BASEAPI
  }/project?uid=${userId}&id=${id}`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('makers err', err)
      return []
    })
}

export const discordMakerId = ($config: NuxtConfig, id: string) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${
    $config.BASEAPI
  }/maker?id=${id}`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('makers err', err)
      return []
    })
}

export const makers = ($config: NuxtConfig) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${
    $config.BASEAPI
  }/makershunt`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('makers err', err)
      return []
    })
}

export const feed = ($config: NuxtConfig) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${
    $config.BASEAPI
  }/feed`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('feed err', err)
      return []
    })
}

export const ep = (guid: string, $config: NuxtConfig) => {
  const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${
    $config.BASEAPI
  }/ep?guid=${guid}`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('ep err', err)
      return []
    })
}
