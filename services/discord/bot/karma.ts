import { Interaction, ApplicationCommandInteractionDataOption } from '../command'
import { addKarmaById, getKarmaById } from '../../../services/firebase/karma'
import { updateUser, getAllUsers } from '../../../services/firebase/discord'
import { openChannel, ResBot, sendChannel, sendTxtLater } from './utils'
import { KarmaAll, User } from './../../types'

const afterAdd = async (value: number, userId: string, curKarma: KarmaAll): Promise<string> => {
  const botString =
    value > 0
      ? `Merci <@${userId}> ❤️ !
  Ton karma 🕉 est maintenant de: ${curKarma.total}`
      : `Pas cool <@${userId}> 😩!
  Ton karma 🕉 est maintenant de: ${curKarma.total}`
  if (curKarma.total < 0) {
    const channel = await openChannel(userId)
    console.error('channel', channel)
    await sendChannel(channel.id, `Ton karma est négatif ... un admin vas te contacter.`)
  }
  await updateUser(userId, { karma: curKarma.total })
  return botString
}

const karmaAdd = async (option: ApplicationCommandInteractionDataOption, senderId: string): Promise<ResBot> => {
  const userId = option.value
  if (userId) {
    console.error('add karma userId', userId)
    if (senderId === userId) {
      return { content: "Tu ne peux pas t'ajouter du karma toi même !" }
    }
    try {
      console.error('start addKarmaById')
      const currentKarma = await addKarmaById(userId, senderId, 1)
      console.error('addKarmaById')
      const botString = await afterAdd(1, userId, currentKarma)
      console.error('afterAdd', botString)
      return { content: botString }
    } catch (err) {
      console.error('karmaAdd', err)
      return { content: 'Erreur karma' }
    }
  } else {
    return { content: 'Donne moi un Maker 👨‍🌾 !' }
  }
}

const karmaRm = async (option: ApplicationCommandInteractionDataOption, senderId: string): Promise<ResBot> => {
  const userId = option.value
  if (!userId) {
    return { content: 'Donne moi un Maker 👨‍🌾 !' }
  }
  console.error('remove karma userId', userId)
  if (senderId === userId) {
    return { content: 'Tu ne peux pas te prendre du karma toi même !' }
  }
  const currentKarma = await addKarmaById(userId, senderId, -1)
  const botString = await afterAdd(1, userId, currentKarma)
  return { content: botString }
}

const generateKarmaStats = async (): Promise<string> => {
  let result = ''
  let users = await getAllUsers()
  users = users.sort((firstEl: User, secondEl: User) => secondEl.karma - firstEl.karma)
  users.forEach((element) => {
    result += `<@${element.userId}> = ${element.karma} 🕉\n`
  })
  return result
}

const karmaStats = async (option: ApplicationCommandInteractionDataOption): Promise<ResBot> => {
  const userId = option.value
  if (userId) {
    console.error('stats karma userId', userId)
    const curKarma = await getKarmaById(userId)
    return { content: `<@${userId}> as ${curKarma.total} karma 🕉!` }
  } else {
    return { content: 'Donne moi un Maker 👨‍🌾 !' }
  }
}

const karmaLadder = async (): Promise<ResBot> => {
  console.error('stats karma global')
  return {
    content: `Voici le classement karma de tous les makers:
${await generateKarmaStats()}`,
  }
}

export const karmaFn = (option: ApplicationCommandInteractionDataOption, senderId: string): Promise<any> => {
  if (option.name === 'donner' && option.options && option.options.length > 0) {
    return karmaAdd(option.options[0], senderId)
  }
  if (option.name === 'enlever' && option.options && option.options.length > 0) {
    return karmaRm(option.options[0], senderId)
  }
  if (option.name === 'voir' && option.options && option.options.length > 0) {
    return karmaStats(option.options[0])
  }
  if (option.name === 'classement') {
    return karmaLadder()
  }
  return Promise.resolve({ content: `La Commande ${option.name} n'est pas pris en charge 🤫` })
}
