import axios from 'axios'
import { NuxtConfig } from '@nuxt/types'
import { Episode } from './feed'
import { User } from './discord/bot/user'
import { Project } from './discord/bot/project'
import { Person } from './types'

export const discordPosts = ($config: NuxtConfig): Promise<User[]> => {
  const url = `${$config.BASEAPI}/posts`
  console.error('discordPosts', url)
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('discordPosts err', err)
      return []
    })
}

export const discordMakers = ($config: NuxtConfig): Promise<User[]> => {
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

export const discordProjects = ($config: NuxtConfig): Promise<Project[]> => {
  const url = `${$config.BASEAPI}/project`
  console.error('discordProjects', url)
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('discordProjects err', err)
      return []
    })
}

export const discordHashtag = (
  $config: NuxtConfig,
  userId: string,
  hashtag: string
): Promise<Project> => {
  const url = `${$config.BASEAPI}/project?uid=${userId}&hashtag=${hashtag}`
  return axios
    .get(url)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error('discordHashtag err', err)
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

export const makers = ($config: NuxtConfig): Promise<Person[]> => {
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

export const feed = ($config: NuxtConfig): Promise<Episode[]> => {
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

export const ep = (guid: string, $config: NuxtConfig): Promise<Episode> => {
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
