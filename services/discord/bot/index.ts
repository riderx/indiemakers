import { InteractionType } from 'discord-interactions'
import { ApplicationCommandInteractionDataOption, Interaction } from '../command'
import { userFn } from './user'
import { incomeFn } from './incomes'
import { projectFn } from './project'
import { sendTxtLater } from './utils'
import { karmaFn } from './karma'
import { taskFn } from './tasks'
import { postFn } from './post'

const im = (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId: string): Promise<void> => {
  try {
    if (option.name === 'karma' && option.options && option.options.length > 0) {
      return karmaFn(interaction, option.options[0], senderId)
    }
    if (option.name === 'projet' && option.options && option.options.length > 0) {
      return projectFn(interaction, option.options[0], senderId)
    }
    if (option.name === 'post' && option.options && option.options.length > 0) {
      return postFn(interaction, option.options[0], senderId)
    }
    if (option.name === 'tache' && option.options && option.options.length > 0) {
      return taskFn(interaction, option.options[0], senderId)
    }
    if (option.name === 'revenu' && option.options && option.options.length > 0) {
      return incomeFn(interaction, option.options[0], senderId)
    }
    if (option.name === 'maker' && option.options && option.options.length > 0) {
      return userFn(interaction, option.options[0], senderId)
    }
    if (option.name === 'doc') {
      return sendTxtLater(
        `Voici la doc pou m'utiliser ! https://indiemakers.gitbook.io/bot/`,
        [],
        interaction.application_id,
        interaction.token
      )
    }
    return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge 🤫`, [], interaction.application_id, interaction.token)
  } catch (err) {
    console.error('im', err)
    return sendTxtLater(`La Commande ${option.name} a échoué`, [], interaction.application_id, interaction.token)
  }
}

const discordInteraction = (interaction: Interaction): Promise<void> => {
  if (interaction && interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data) {
    if (interaction.data.name === 'im' && interaction.data.options && interaction.data.options.length > 0 && interaction.member.user) {
      return im(interaction, interaction.data.options[0], interaction.member.user.id)
    }
    return sendTxtLater(
      `La Commande ${interaction.data.name} n'est pas pris en charge 🤫`,
      [],
      interaction.application_id,
      interaction.token
    )
  }
  return Promise.resolve()
}

export default discordInteraction
