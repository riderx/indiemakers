import dayjs from 'dayjs'
import admin from 'firebase-admin'
import {
  Interaction,
  ApplicationCommandInteractionDataOption,
} from '../command'
import { sendTxtLater } from './utils'
import { getAllProjects } from './project'
import { updateUser, User } from './user'

export interface Income {
  id?: string
  ammount: number
  stripeCharges?: Income[]
  status: 'expense' | 'income'
  date: string
  createdAt?: string
  updatedAt?: string
}
export interface IncomeAll {
  incomes: Income[]
  total: number
}
export const createProjectIncome = (
  userId: string,
  hashtag: string,
  income: Partial<Income>
) => {
  return admin
    .firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`)
    .add({ ...income, createdAt: dayjs().toISOString() })
}

export const deleteProjectIncome = (
  userId: string,
  hashtag: string,
  incomeId: string
) => {
  return admin
    .firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`)
    .doc(incomeId)
    .delete()
}

export const updateProjectIncome = (
  userId: string,
  hashtag: string,
  incomeId: string,
  income: Partial<Income>
) => {
  return admin
    .firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`)
    .doc(incomeId)
    .update({ ...income, updatesAt: dayjs().toISOString() })
}

const updateProjecttotalIncome = async (
  userId: string,
  hashtag: string,
  incomes: number
) => {
  const projDoc = await admin
    .firestore()
    .collection(`discord/${userId}/projects/`)
    .doc(hashtag.toLowerCase())
    .get()
  if (!projDoc.exists) {
    console.error(
      `Cannot add total to userId: ${userId}, hashtag: ${hashtag.toLowerCase()}, incomes: ${incomes}`
    )
  }
  return projDoc.ref.update({ incomes, updatedAt: dayjs().toISOString() })
}

export const getAllProjectsIncomes = async (
  userId: string,
  hashtag: string
): Promise<IncomeAll> => {
  try {
    const documents = await admin
      .firestore()
      .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/incomes`)
      .get()
    const incomes: Income[] = []
    documents.docs.map((doc) => {
      const data = doc.data() as Income
      if (data !== undefined) {
        incomes.push({ id: doc.id, ...data })
      }
      return data
    })
    const total = incomes.reduce((tt, current) => {
      return current.status === 'expense'
        ? tt - Number(current.ammount)
        : tt + Number(current.ammount)
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

const incomeAdd = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
) => {
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
      date.set('month', Number(element.value) - 1)
    } else if (element.name === 'année') {
      date.set('year', Number(element.value))
    }
  })
  if (newIncome.ammount) {
    newIncome.status = newIncome.ammount < 0 ? 'expense' : 'income'
    newIncome.ammount = Math.abs(newIncome.ammount)
  }
  newIncome.date = date.toISOString()
  return Promise.all([
    sendTxtLater(
      `${newIncome.status === 'expense' ? 'La dépense' : 'Le revenu'} 💰: ${
        newIncome.ammount
      } ${dayjs(newIncome.date).format('MM/YYYY')}
À été ajouté au projet #${hashtag}, 🎉!`,
      [],
      interaction.application_id,
      interaction.token
    ),
    getAllProjectsIncomes(userId, hashtag).then((curIncomes) =>
      updateProjecttotalIncome(userId, hashtag, curIncomes.total + 1)
    ),
    createProjectIncome(userId, hashtag, newIncome).then(() =>
      getTotalIncomeByUser(userId).then((superTotal) => {
        const updatedUser: Partial<User> = {
          incomes: superTotal + 1,
        }
        return updateUser(userId, updatedUser)
      })
    ),
  ]).then(() => Promise.resolve())
}

const incomeEdit = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
) => {
  let hashtag = ''
  let incomeId = ''
  const update: Partial<Income> = {
    updatedAt: dayjs().toISOString(),
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
      update.ammount = element.value
    } else if (element.name === 'status') {
      update.status = element.value
    } else if (element.name === 'mois') {
      date.set('month', Number(element.value) - 1)
    } else if (element.name === 'année') {
      date.set('year', Number(element.value))
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
      interaction.token
    ),
  ]).then(() => Promise.resolve())
}

const incomesView = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
) => {
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
        interaction.token
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
      incomeInfos += `💰 ${element.id} - ${dayjs(element.createdAt).format(
        'DD-MM-YYYY'
      )}    ${element.status === 'expense' ? '-' : ''}${element.ammount} €\n`
    })
    return sendTxtLater(
      incomeInfos,
      [],
      interaction.application_id,
      interaction.token
    )
  } else {
    return sendTxtLater(
      `Je ne trouve pas le projet #${hashtag} pour <@${makerId}> 😅`,
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const incomesDelete = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
) => {
  let hashtag = ''
  let incomeId = ''
  options.forEach((element: any) => {
    if (element.name === 'hashtag') {
      hashtag = element.value
    } else if (element.name === 'id') {
      incomeId = element.value
    }
  })
  const curIncomes = await getAllProjectsIncomes(userId, hashtag)
  return Promise.all([
    deleteProjectIncome(userId, hashtag, incomeId),
    updateProjecttotalIncome(userId, hashtag, curIncomes.total),
    sendTxtLater(
      `Tu as supprimé le revenu ${incomeId} 💸!`,
      [],
      interaction.application_id,
      interaction.token
    ),
  ]).then(() => Promise.resolve())
}

export const incomeFn = (
  interaction: any,
  option: ApplicationCommandInteractionDataOption,
  userId: string
): Promise<void> => {
  if (
    option.name === 'ajouter' &&
    option.options &&
    option.options.length > 0
  ) {
    return incomeAdd(interaction, option.options, userId)
  }
  if (option.name === 'liste' && option.options && option.options.length > 0) {
    return incomesView(interaction, option.options, userId)
  }
  if (
    option.name === 'modifier' &&
    option.options &&
    option.options.length > 0
  ) {
    return incomeEdit(interaction, option.options, userId)
  }
  if (
    option.name === 'supprimer' &&
    option.options &&
    option.options.length > 0
  ) {
    return incomesDelete(interaction, option.options, userId)
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token
  )
}
