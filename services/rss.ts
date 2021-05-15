import axios from 'axios'
import { NuxtConfig } from '@nuxt/types'
import { User } from './discord/bot/user'
import { Project } from './discord/bot/project'

export const discordMakers = ($config: NuxtConfig) => {
  const url = `${$config.BASEAPI}/community`
  console.error('discordMakers', url)
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('discordMakers err', err)
      return []
    })
}

export const discordProjectId = (
  $config: NuxtConfig,
  userId: string,
  id: string
): Promise<Project> => {
  const url = `${$config.BASEAPI}/project?uid=${userId}&id=${id}`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('discordProjectId err', err)
      return []
    })
}

export const discordMakerId = (
  $config: NuxtConfig,
  id: string
): Promise<User> => {
  const url = `${$config.BASEAPI}/maker?id=${id}`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('discordMakerId err', err)
      return []
    })
}

export const makers = ($config: NuxtConfig) => {
  const url = `${$config.BASEAPI}/makershunt`
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
  const url = `${$config.BASEAPI}/feed`
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
  const url = `${$config.BASEAPI}/ep?guid=${guid}`
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
