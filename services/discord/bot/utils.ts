import { InteractionResponseType } from 'discord-interactions'
import { Response as Res } from 'express'
import axios from 'axios'
import { hexToDec } from 'hex2dec'
import admin from 'firebase-admin'

interface DiscorUser {
  avatar: string
  username: string
}
export interface Field {
  name: string
  value: string
  inline: boolean
}
interface Author {
  name: string
  url?: string
  // eslint-disable-next-line camelcase
  icon_url?: string
}
interface Footer {
  text: string
  // eslint-disable-next-line camelcase
  icon_url: string
}

interface Image {
  url: string
}
export interface Embed {
  title?: string
  description?: string
  url?: string
  color?: string
  fields?: Field[]
  author?: Author
  footer?: Footer
  timestamp?: string
  thumbnail?: Image
  image?: Image
}
interface DiscordMessage {
  content: string
  embeds?: Embed[]
}

export const image = (url: string): Image => ({ url })
// eslint-disable-next-line camelcase
export const footer = (text: string, icon_url: string): Footer => ({
  text,
  icon_url,
})
export const author = (
  name: string,
  url: string,
  // eslint-disable-next-line camelcase
  icon_url: string
): Author => ({ name, url, icon_url })
export const field = (name: string, value: string, inline = true): Field => ({
  name,
  value,
  inline,
})
export const embed = (
  title: string | undefined = undefined,
  description: string | undefined = undefined,
  color: string | undefined = undefined,
  fields: Field[] = [],
  author: Author | undefined = undefined,
  footer: Footer | undefined = undefined,
  timestamp: string | undefined = undefined,
  url: string | undefined = undefined,
  thumbnail: Image | undefined = undefined,
  image: Image | undefined = undefined
): Embed => {
  const data: Embed = { fields }
  if (title && title !== '') {
    data.title = title
  }
  if (url && url !== '') {
    data.url = url
  }
  if (description && description !== '') {
    data.description = description
  }
  if (color && color !== '') {
    data.color = hexToDec(`0x${color}`)
  }
  if (timestamp && timestamp !== '') {
    data.timestamp = timestamp
  }
  if (footer) {
    data.footer = footer
  }
  if (author) {
    data.author = author
  }
  if (thumbnail) {
    data.thumbnail = thumbnail
  }
  if (image) {
    data.image = image
  }
  return data
}

export const sendTxt = (res: Res, text: string): Res =>
  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: text,
    },
  })

export const getUserData = async (
  userId: string
): Promise<DiscorUser | undefined> => {
  const url = `https://discord.com/api/v8/users/${userId}`
  const data = (
    await admin.firestore().collection('bot').doc('config').get()
  ).data()
  if (!data) {
    return Promise.resolve(undefined)
  }
  const headers = {
    Authorization: `Bot ${
      process.env.BOT_TOKEN ? process.env.BOT_TOKEN : data.bot_token
    }`,
  }
  try {
    const res = await axios.get(url, { headers })
    return Promise.resolve(res.data as DiscorUser)
  } catch (err) {
    console.error('getUserData', err)
    return Promise.resolve(undefined)
  }
}

export const sendTxtLoading = (res: Res): Res =>
  res.send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Le bot réflechis..',
    },
  })

export const sendTxtLater = async (
  content: string,
  embeds: Embed[] = [],
  applicationId: string,
  interactionToken: string
): Promise<void> => {
  const url = `https://discord.com/api/v8/webhooks/${applicationId}/${interactionToken}/messages/@original`
  const body: DiscordMessage = {
    content,
    embeds,
  }
  try {
    await axios.patch(url, body)
    return Promise.resolve()
  } catch (err) {
    console.error('sendTxtLater', body, err.response)
    await axios
      .patch(url, { content: "🤖 Oups, previens mon créateur j'ai un bug!" })
      .catch((errErr) => {
        console.error('sendTxtLaterFallback', err.response, errErr.response)
      })
    return Promise.resolve()
  }
}

export const openChannel = async (userId: string): Promise<any> => {
  const url = 'https://discord.com/api/v8/users/@me/channels'
  const data = (
    await admin.firestore().collection('bot').doc('config').get()
  ).data()
  if (!data) {
    return Promise.resolve(undefined)
  }
  const headers = {
    Authorization: `Bot ${
      process.env.BOT_TOKEN ? process.env.BOT_TOKEN : data.discord.bot_token
    }`,
  }
  const res = await axios
    .post(url, { recipient_id: userId }, { headers })
    .catch((err) => {
      console.error('openChannel', err.response)
      return err
    })
  return Promise.resolve(res.data as any)
}
// https://discord.com/api/webhooks/841492487125598218/b0Rvbv41Uy2w6UxUutctXYeKYd0QAXOKnjhgCOTOyfjSs9hgpYOPxjizWiu4vi-s17nX

export const sendChannel = async (
  channelId: string,
  content: string,
  embed: Embed | undefined = undefined
): Promise<any> => {
  const url = `https://discord.com/api/v8/channels/${channelId}/messages`
  const data = (
    await admin.firestore().collection('bot').doc('config').get()
  ).data()
  if (!data) {
    return Promise.resolve(undefined)
  }
  const headers = {
    Authorization: `Bot ${
      process.env.BOT_TOKEN ? process.env.BOT_TOKEN : data.discord.bot_token
    }`,
  }
  const body: any = { content }
  if (embed) {
    body.embed = embed
  }
  const res = await axios.post(url, body, { headers }).catch((err) => {
    console.error('sendChannel content', url, JSON.stringify(content))
    console.error('sendChannel err', err.response)
    return err
  })
  return Promise.resolve(res.data as any)
}
