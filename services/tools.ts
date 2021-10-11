import { NuxtConfig } from '@nuxt/types'
import axios from 'axios'
import { Tool } from './types'

export const getTools = ($config: NuxtConfig): Promise<Tool[] | null> => {
  const url = `${$config.BASEAPI}/tools`
  return axios
    .get(url)
    .then((response) => {
      return response.data as Tool[]
    })
    .catch((err) => {
      console.error('discordHashtag err', err)
      return null
    })
}
