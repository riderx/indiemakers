import { Interaction, ApplicationCommandInteractionDataOption } from '../command'
import { addKarmaById, getKarmaById } from '../../../services/firebase/karma'
import { updateUser, getAllUsers } from '../../../services/firebase/discord'
import { openChannel, sendChannel, sendTxtLater } from './utils'
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

const karmaAdd = async (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId: string): Promise<void> => {
  const userId = option.value
  if (userId) {
    console.error('add karma userId', userId)
    if (senderId === userId) {
      return sendTxtLater(
        "Tu ne peux pas t'ajouter du karma toi même !",
        [],
        interaction.application_id,
        interaction.token,
        interaction.channel_id
      )
    }
    try {
      console.error('start addKarmaById')
      const currentKarma = await addKarmaById(userId, senderId, 1)
      console.error('addKarmaById')
      const botString = await afterAdd(1, userId, currentKarma)
      console.error('afterAdd')
      return sendTxtLater(botString, [], interaction.application_id, interaction.token, interaction.channel_id)
    } catch (err) {
      console.error('karmaAdd', err)
      return sendTxtLater('Erreur karma', [], interaction.application_id, interaction.token, interaction.channel_id)
    }
  } else {
    return sendTxtLater('Donne moi un Maker 👨‍🌾 !', [], interaction.application_id, interaction.token, interaction.channel_id)
  }
}

const karmaRm = async (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId: string): Promise<void> => {
  const userId = option.value
  if (!userId) {
    return sendTxtLater('Donne moi un Maker 👨‍🌾 !', [], interaction.application_id, interaction.token, interaction.channel_id)
  }
  console.error('remove karma userId', userId)
  if (senderId === userId) {
    return sendTxtLater(
      'Tu ne peux pas te prendre du karma toi même !',
      [],
      interaction.application_id,
      interaction.token,
      interaction.channel_id
    )
  }
  const currentKarma = await addKarmaById(userId, senderId, -1)
  const botString = await afterAdd(1, userId, currentKarma)
  return sendTxtLater(botString, [], interaction.application_id, interaction.token, interaction.channel_id)
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

const karmaStats = async (interaction: Interaction, option: ApplicationCommandInteractionDataOption): Promise<void> => {
  const userId = option.value
  if (userId) {
    console.error('stats karma userId', userId)
    const curKarma = await getKarmaById(userId)
    return sendTxtLater(
      `<@${userId}> as ${curKarma.total} karma 🕉!`,
      [],
      interaction.application_id,
      interaction.token,
      interaction.channel_id
    )
  } else {
    return sendTxtLater('Donne moi un Maker 👨‍🌾 !', [], interaction.application_id, interaction.token, interaction.channel_id)
  }
}

const karmaLadder = async (interaction: Interaction): Promise<void> => {
  console.error('stats karma global')
  await sendTxtLater(
    `Voici le classement karma de tous les makers:

${await generateKarmaStats()}`,
    [],
    interaction.application_id,
    interaction.token,
    interaction.channel_id
  )
}

export const karmaFn = (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId: string): Promise<void> => {
  if (option.name === 'donner' && option.options && option.options.length > 0) {
    return karmaAdd(interaction, option.options[0], senderId)
  }
  if (option.name === 'enlever' && option.options && option.options.length > 0) {
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
    interaction.token,
    interaction.channel_id
  )
}
