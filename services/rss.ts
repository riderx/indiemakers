import axios from 'axios'
import { NuxtConfig } from '@nuxt/types'
import { Episode, Person, Post, Project, User } from './types'

export const discordPosts = ($config: NuxtConfig): Promise<Post[]> => {
  const url = `${$config.BASEAPI}/posts`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Post[]
    })
    .catch((err) => {
      console.error('discordPosts err', err)
      return []
    })
}

export const discordMakers = ($config: NuxtConfig): Promise<User[]> => {
  const url = `${$config.BASEAPI}/makers`
  return axios
    .get(url)
    .then((response) => {
      return response.data as User[]
    })
    .catch((err) => {
      console.error('discordMakers err', err)
      return []
    })
}

export const discordProjects = ($config: NuxtConfig): Promise<Project[]> => {
  const url = `${$config.BASEAPI}/project`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Project[]
    })
    .catch((err) => {
      console.error('discordProjects err', err)
      return []
    })
}

export const discordHashtag = ($config: NuxtConfig, userId: string, hashtag: string): Promise<Project | null> => {
  const url = `${$config.BASEAPI}/project?id=${userId}&hashtag=${hashtag}`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Project
    })
    .catch((err) => {
      console.error('discordHashtag err', err)
      return null
    })
}

export const discordMakerId = ($config: NuxtConfig, id: string): Promise<User | null> => {
  const url = `${$config.BASEAPI}/makers?id=${id}`
  return axios
    .get(url)
    .then((response) => {
      return response.data as User
    })
    .catch((err) => {
      console.error('discordMakerId err', err)
      return null
    })
}

export const makers = ($config: NuxtConfig): Promise<Person[]> => {
  const url = `${$config.BASEAPI}/makershunt`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Person[]
    })
    .catch((err) => {
      console.error('makers err', err)
      return []
    })
}

export const feed = ($config: NuxtConfig): Promise<Episode[]> => {
  const url = `${$config.BASEAPI}/podcasts`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Episode[]
    })
    .catch((err) => {
      console.error('feed err', err)
      return []
    })
}

export const ep = (guid: string, $config: NuxtConfig): Promise<Episode | null> => {
  const url = `${$config.BASEAPI}/podcasts?guid=${guid}`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Episode
    })
    .catch((err) => {
      console.error('ep err', err)
      return null
    })
}

export const epRandom = (guid: string, random: number, $config: NuxtConfig): Promise<Episode[]> => {
  const url = `${$config.BASEAPI}/podcasts?guid=${guid}&random=${random}`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Episode[]
    })
    .catch((err) => {
      console.error('ep err', err)
      return [] as Episode[]
    })
}
