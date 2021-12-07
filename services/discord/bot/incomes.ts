import dayjs from 'dayjs'
import { getFirestore } from 'firebase-admin/firestore'
import { Interaction, ApplicationCommandInteractionDataOption } from '../command'
import { Income, IncomeAll, User } from '../../../services/types'
import { getConfig, updateUser } from '../../../services/firebase/discord'
import { sendChannel, sendTxtLater } from './utils'
import { getAllProjects } from './project'

export const createProjectIncome = async (userId: string, hashtag: string, income: Partial<Income>) => {
  await getFirestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`)
    .add({ ...income, createdAt: dayjs().toISOString() })
  const all = await updateProjecttotalIncome(userId, hashtag)
  const superTotal = await getTotalIncomeByUser(userId)
  if (superTotal === all.total) {
    const config = await getConfig()
    if (config) {
      await sendChannel(
        config.channel_general,
        `Hey Makers, Donnez de la force 💪🏋️‍♂️ a <@${userId}>
  il viens d'ajouter son premier revenu sur #${hashtag}!`
      )
    }
  }
  const updatedUser: Partial<User> = {
    incomes: superTotal,
  }
  return updateUser(userId, updatedUser)
}

export const deleteProjectIncome = async (userId: string, hashtag: string, incomeId: string) => {
  await getFirestore().collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`).doc(incomeId).delete()
  await updateProjecttotalIncome(userId, hashtag)
}

export const updateProjectIncome = (userId: string, hashtag: string, incomeId: string, income: Partial<Income>) => {
  return getFirestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`)
    .doc(incomeId)
    .update({ ...income, updatedAt: dayjs().toISOString() })
}

const updateProjecttotalIncome = async (userId: string, hashtag: string): Promise<IncomeAll> => {
  const projDoc = await getFirestore().collection(`discord/${userId}/projects/`).doc(hashtag.toLowerCase()).get()
  const curIncomes = await getAllProjectsIncomes(userId, hashtag)
  if (!projDoc.exists) {
    console.error(`Cannot add total to userId: ${userId}, hashtag: ${hashtag.toLowerCase()}, incomes: ${curIncomes.total}`)
  }
  await projDoc.ref.update({
    incomes: curIncomes.total,
    updatedAt: dayjs().toISOString(),
  })
  return curIncomes
}

export const getAllProjectsIncomes = async (userId: string, hashtag: string): Promise<IncomeAll> => {
  try {
    const documents = await getFirestore().collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`).get()
    const incomes: Income[] = []
    documents.docs.map((doc) => {
      const data = doc.data() as Income
      if (data !== undefined) {
        incomes.push({ id: doc.id, ...data })
      }
      return data
    })
    const total = incomes.reduce((tt, current) => {
      return current.status === 'expense' ? tt - Number(current.ammount) : tt + Number(current.ammount)
    }, 0)
    return { incomes, total }
  } catch (err) {
    console.error('getAllProjectsIncomes', err)
    return { incomes: [], total: 0 }
  }
}

const getTotalIncomeByUser = async (userId: string): Promise<number> => {
  const projects = await getAllProjects(userId)
  return projects.reduce((tt, project) => tt + project.incomes, 0)
}

const incomeAdd = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string) => {
  let hashtag = ''
  const newIncome: Partial<Income> = {
    createdAt: dayjs().toISOString(),
  }
  let date = dayjs()
  date = date.set('minute', 0)
  date = date.set('hour', 0)
  date = date.set('second', 0)
  date.date(1)
  options.forEach((element: any) => {
    if (element.name === 'hashtag') {
      hashtag = element.value
    } else if (element.name === 'montant') {
      newIncome.ammount = Number(element.value)
    } else if (element.name === 'mois') {
      date = date.set('month', Number(element.value) - 1)
    } else if (element.name === 'année') {
      date = date.set('year', Number(element.value))
    }
  })
  const projDoc = await getFirestore().collection(`discord/${userId}/projects`).doc(hashtag.toLowerCase()).get()
  if (!projDoc.exists) {
    return sendTxtLater(
      `Le projet #${hashtag.toLowerCase()}, n'existe pas. tu peux le crée avec \`/im projet ajouter\` 😇`,
      [],
      interaction.application_id,
      interaction.token,
      interaction.channel_id
    )
  }
  if (newIncome.ammount) {
    newIncome.status = newIncome.ammount < 0 ? 'expense' : 'income'
    newIncome.ammount = Math.abs(newIncome.ammount)
  }
  newIncome.date = date.toISOString()
  await createProjectIncome(userId, hashtag, newIncome)
  return sendTxtLater(
    `${newIncome.status === 'expense' ? 'La dépense' : 'Le revenu'} 💰: ${newIncome.ammount} ${dayjs(newIncome.date).format('MM/YYYY')}
À été ajouté au projet #${hashtag}, 🎉!`,
    [],
    interaction.application_id,
    interaction.token,
    interaction.channel_id
  )
}

const incomeEdit = (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string) => {
  let hashtag = ''
  let incomeId = ''
  const update: Partial<Income> = {}
  let date = dayjs()
  date = date.set('minute', 0)
  date = date.set('hour', 0)
  date = date.set('second', 0)
  date.date(1)
  options.forEach((element: any) => {
    if (element.name === 'hashtag') {
      hashtag = element.value
    } else if (element.name === 'montant') {
      update.ammount = element.value
    } else if (element.name === 'status') {
      update.status = element.value
    } else if (element.name === 'mois') {
      date = date.set('month', Number(element.value) - 1)
    } else if (element.name === 'année') {
      date = date.set('year', Number(element.value))
    } else if (element.name === 'id') {
      incomeId = element.value
    }
  })
  update.date = date.toISOString()
  return Promise.all([
    updateProjectIncome(userId, hashtag, incomeId, update),
    sendTxtLater(
      `Le revenu 💰 ${incomeId} a été mise à jour dans le projet #${hashtag}, 🎉!`,
      [],
      interaction.application_id,
      interaction.token,
      interaction.channel_id
    ),
  ]).then(() => Promise.resolve())
}

const incomesView = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string) => {
  let hashtag = ''
  let makerId = userId
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (element.name === 'hashtag') {
      hashtag = element.value || ''
    } else if (element.name === 'maker') {
      makerId = element.value || ''
    }
  })
  if (hashtag) {
    const allIncomes = await getAllProjectsIncomes(makerId, hashtag)
    let target
    if (allIncomes.incomes.length === 0) {
      return sendTxtLater(
        'Pas encore de revenue sur ce projet, ça viendra !',
        [],
        interaction.application_id,
        interaction.token,
        interaction.channel_id
      )
    } else if (makerId !== userId) {
      target = `<@${makerId}> a fait`
    } else {
      target = `Tu as fait`
    }
    let incomeInfos = `${target} ${allIncomes.total} € sur ce projet, BRAVO 🎉!

Voici La liste des revenus :

`
    allIncomes.incomes.forEach((element: Income) => {
      incomeInfos += `💰 ${element.id} - ${dayjs(element.createdAt).format('DD-MM-YYYY')}    ${element.status === 'expense' ? '-' : ''}${
        element.ammount
      } €\n`
    })
    return sendTxtLater(incomeInfos, [], interaction.application_id, interaction.token, interaction.channel_id)
  } else {
    return sendTxtLater(
      `Je ne trouve pas le projet #${hashtag} pour <@${makerId}> 😅`,
      [],
      interaction.application_id,
      interaction.token,
      interaction.channel_id
    )
  }
}

const incomesDelete = (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string) => {
  let hashtag = ''
  let incomeId = ''
  options.forEach((element: any) => {
    if (element.name === 'hashtag') {
      hashtag = element.value
    } else if (element.name === 'id') {
      incomeId = element.value
    }
  })
  return Promise.all([
    deleteProjectIncome(userId, hashtag, incomeId),
    sendTxtLater(`Tu as supprimé le revenu ${incomeId} 💸!`, [], interaction.application_id, interaction.token, interaction.channel_id),
  ]).then(() => Promise.resolve())
}

export const incomeFn = (interaction: any, option: ApplicationCommandInteractionDataOption, userId: string): Promise<void> => {
  if (option.name === 'ajouter' && option.options && option.options.length > 0) {
    return incomeAdd(interaction, option.options, userId)
  }
  if (option.name === 'liste' && option.options && option.options.length > 0) {
    return incomesView(interaction, option.options, userId)
  }
  if (option.name === 'modifier' && option.options && option.options.length > 0) {
    return incomeEdit(interaction, option.options, userId)
  }
  if (option.name === 'supprimer' && option.options && option.options.length > 0) {
    return incomesDelete(interaction, option.options, userId)
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token,
    interaction.channel_id
  )
}
