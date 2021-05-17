import dayjs from 'dayjs'
import admin from 'firebase-admin'
import {
  Interaction,
  ApplicationCommandInteractionDataOption,
} from '../command'
import { sendTxtLater } from './utils'
import { updateUser, getAllUsers, User } from './user'

interface Karma {
  id?: string
  userId: string
  createdAt: string
  value: number
}
const getKarmaById = async (
  id: string
): Promise<{ karmas: Karma[]; total: number }> => {
  try {
    const documents = await admin
      .firestore()
      .collection(`discord/${id}/karma`)
      .get()
    const karmas: Karma[] = []
    documents.docs.forEach((doc) => {
      const data = doc.data() as Karma
      if (data !== undefined) {
        karmas.push({ id: doc.id, ...(data as Karma) })
      }
    })
    const total = karmas.reduce((tt, current) => tt + current.value, 0)
    return { karmas, total }
  } catch (err) {
    console.error('getKarmaById', err)
    return { karmas: [], total: 0 }
  }
}

const addKarmaById = (userId: string, senderId: string, value: number) =>
  admin
    .firestore()
    .collection(`discord/${userId}/karma`)
    .add({ userId: senderId, value, createdAt: dayjs().toISOString() })

const karmaAdd = async (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  senderId: string
): Promise<void> => {
  const userId = option.value
  if (userId) {
    console.error('add karma userId', userId)
    if (senderId === userId) {
      return sendTxtLater(
        "Tu ne peux pas t'ajouter du karma toi même !",
        [],
        interaction.application_id,
        interaction.token
      )
    }
    const curKarma = await getKarmaById(userId)
    const botString = `Tu as donné du karma a <@${userId}> 😎
    Total 🕉: ${curKarma.total + 1} karma!`
    return Promise.all([
      updateUser(userId, { karma: curKarma.total + 1 }),
      addKarmaById(userId, senderId, 1),
      sendTxtLater(
        botString,
        [],
        interaction.application_id,
        interaction.token
      ),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater(
      'Donne moi un Maker 👨‍🌾 !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const karmaRm = async (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  senderId: string
): Promise<void> => {
  const userId = option.value
  if (!userId) {
    return sendTxtLater(
      'Donne moi un Maker 👨‍🌾 !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
  console.error('remove karma userId', userId)
  if (senderId === userId) {
    return sendTxtLater(
      'Tu ne peux pas te prendre du karma toi même !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
  const curKarma = await getKarmaById(userId)
  if (curKarma.total > 0) {
    const botString = `Tu as enlevé du karma a <@${userId}>
    Total 🕉: ${curKarma.total - 1} karma 😢`
    return Promise.all([
      updateUser(userId, { karma: curKarma.total - 1 }),
      addKarmaById(userId, senderId, -1),
      sendTxtLater(
        botString,
        [],
        interaction.application_id,
        interaction.token
      ),
    ]).then(() => Promise.resolve())
  }
  return sendTxtLater(
    `<@${userId}> n'as plus de karma 🕉...
    Laisse le tranquile 😢!`,
    [],
    interaction.application_id,
    interaction.token
  )
}

const generateKarmaStats = async (): Promise<string> => {
  let result = ''
  const allUsers = await getAllUsers()
  allUsers.users = allUsers.users.sort(
    (firstEl: User, secondEl: User) => secondEl.karma - firstEl.karma
  )
  allUsers.users.forEach((element) => {
    result += `<@${element.userId}> = ${element.karma} 🕉\n`
  })
  return result
}

const karmaStats = async (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption
): Promise<void> => {
  const userId = option.value
  if (userId) {
    console.error('stats karma userId', userId)
    const curKarma = await getKarmaById(userId)
    return sendTxtLater(
      `<@${userId}> as ${curKarma.total} karma 🕉!`,
      [],
      interaction.application_id,
      interaction.token
    )
  } else {
    return sendTxtLater(
      'Donne moi un Maker 👨‍🌾 !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const karmaLadder = async (interaction: Interaction): Promise<void> => {
  console.error('stats karma global')
  return sendTxtLater(
    `Voici le classement karma de tous les makers:

    ${await generateKarmaStats()}`,
    [],
    interaction.application_id,
    interaction.token
  )
}

export const karmaFn = (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  senderId: string
): Promise<void> => {
  if (option.name === 'donner' && option.options && option.options.length > 0) {
    return karmaAdd(interaction, option.options[0], senderId)
  }
  if (
    option.name === 'enlever' &&
    option.options &&
    option.options.length > 0
  ) {
    return karmaRm(interaction, option.options[0], senderId)
  }
  if (option.name === 'voir' && option.options && option.options.length > 0) {
    return karmaStats(interaction, option.options[0])
  }
  if (option.name === 'classement') {
    return karmaLadder(interaction)
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token
  )
}
