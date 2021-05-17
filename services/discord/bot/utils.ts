import { InteractionResponseType } from 'discord-interactions'
import { Response as Res } from 'express'
import axios from 'axios'
import { hexToDec } from 'hex2dec'
import admin from 'firebase-admin'
import dayjs from 'dayjs'
import { getAllUsers, usersViewStreak } from './user'
import { updateUserTaskAndStreak } from './tasks'
import { updateRevenueAllProject } from './stripe'

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
    console.log('color', data.color, color)
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
interface Translations {
  [key: string]: string
}
export const transformKey = (
  translations: Translations,
  key: string,
  left: boolean = false
): string => {
  const found = Object.keys(translations).find((val: string) =>
    left ? (translations as any)[val] === key : val === key
  )
  if (found) {
    return left ? found : (translations as any)[found]
  }
  return key
}

export const getFields = (
  obj: object,
  publicFields: string[],
  translations: Translations
) => {
  const fields: Field[] = []
  publicFields.forEach((key) => {
    if ((obj as any)[key]) {
      fields.push(
        field(
          transformKey(translations, key, true),
          String((obj as any)[key] || 0)
        )
      )
    }
  })
  return fields
}

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
    const res = await axios.patch(url, body)
    return res.data
  } catch (err) {
    if (err.response) {
      // Request made and server responded
      console.error('sendTxtLater response', err.response.data)
      console.error('sendTxtLater response status', err.response.status)
      // console.error(err.response.headers)
    } else if (err.request) {
      // The request was made but no response was received
      console.error('sendTxtLater request', err.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('sendTxtLater Error', err.message)
    }
    // console.error('sendTxtLater content', url, JSON.stringify(content))
    const res = await axios
      .patch(url, { content: "🤖 Oups, previens mon créateur j'ai un bug!" })
      .catch((errErr) => {
        console.error('sendTxtLaterFallback', err.response, errErr.response)
        return admin
          .firestore()
          .collection('errors')
          .add(err)
          .then(() => err)
      })
    await admin
      .firestore()
      .collection('errors')
      .add({ function: 'sendTxtLater', url, error: JSON.stringify(err) })
      .then(() => err)
    return res
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
  if (data.discordResetAfter && data.discordResetAfter > 0) {
    console.error('Sleep a bit', data.discordResetAfter)
    await sleep(data.discordResetAfter)
  }
  const res = await axios
    .post(url, { recipient_id: userId }, { headers })
    .then(async (res) => {
      if (
        res?.headers['x-ratelimit-reset-after'] &&
        !res?.headers['x-ratelimit-remaining']
      ) {
        await saveRateLimit(res.headers['x-ratelimit-reset-after'])
      } else if (data.discordResetAfter && data.discordResetAfter > 0) {
        await saveRateLimit(0)
      }
      return res.data
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.headers['x-ratelimit-reset-after']) {
          await saveRateLimit(err.response.headers['x-ratelimit-reset-after'])
        }
      }
      return admin
        .firestore()
        .collection('errors')
        .add({
          function: 'openChannel',
          headers,
          userId,
          url,
          error: JSON.stringify(err),
        })
        .then(() => err)
    })
  return res
}
// https://discord.com/api/webhooks/841492487125598218/b0Rvbv41Uy2w6UxUutctXYeKYd0QAXOKnjhgCOTOyfjSs9hgpYOPxjizWiu4vi-s17nX
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const saveRateLimit = (limit: string | number) => {
  console.error('sendChannel x-ratelimit-reset-after', limit)
  return admin
    .firestore()
    .collection('bot')
    .doc('config')
    .update({
      discordResetAfter: Number(limit) * 1000,
    })
}

export const lateBot = async () => {
  const res = await admin.firestore().collection('bot').doc('config').get()
  const data = res.data()
  if (data) {
    await sendChannel(
      data.channel_bip,
      "Hey Makers, il est temps de noter vos taches dans vos projets et d'aller chill !"
    )
  }
}

export const morningBot = async () => {
  const res = await admin.firestore().collection('bot').doc('config').get()
  const data = res.data()
  if (data) {
    const usrTt = await getAllUsers()
    const usersInfoCards = usersViewStreak(usrTt)
    await Promise.all(
      usrTt.users.map((usr) => {
        return updateUserTaskAndStreak(usr)
      })
    )
    await sendChannel(
      data.channel_bip,
      'Hey Makers, Encore une belle journée pour shipper !\n\nContinuez comme ça !'
    )
    await Promise.all(
      usersInfoCards.map((card) => {
        return sendChannel(data.channel_bip, '', card)
      })
    )
    if (dayjs().day() === 1) {
      await sendChannel(
        data.channel_general,
        'Hey Makers, Faites moi un petit récap de votre semaine 1 Bon point / 1 point relou, minimum 💪!'
      )
      await updateRevenueAllProject()
    }
  }
}

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
  if (data.discordResetAfter && data.discordResetAfter > 0) {
    console.error('Sleep a bit', data.discordResetAfter)
    await sleep(data.discordResetAfter)
  }
  const res = await axios
    .post(url, body, { headers })
    .then(async (res) => {
      if (
        res?.headers['x-ratelimit-reset-after'] &&
        !res?.headers['x-ratelimit-remaining']
      ) {
        await saveRateLimit(res.headers['x-ratelimit-reset-after'])
      } else if (data.discordResetAfter && data.discordResetAfter > 0) {
        await saveRateLimit(0)
      }
      return res.data
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.headers['x-ratelimit-reset-after']) {
          await saveRateLimit(err.response.headers['x-ratelimit-reset-after'])
        }
      }
      return admin
        .firestore()
        .collection('errors')
        .add({
          function: 'sendChannel',
          headers,
          body,
          url,
          error: JSON.stringify(err),
        })
        .then(() => err)
    })
  return res
}
