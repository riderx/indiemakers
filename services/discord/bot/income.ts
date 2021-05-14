import { firestore } from 'firebase-admin'
import dayjs from 'dayjs'
import {
  Interaction,
  ApplicationCommandInteractionDataOption,
} from '../command'
import { sendTxtLater } from './utils'

export interface Income {
  id?: string
  ammount: number
  stripeCharges?: Income[]
  status: 'expense' | 'income'
  date: string
  createdAt?: string
  updatedAt?: string
}

export const createProjectIncome = (
  userId: string,
  projectId: string,
  income: Partial<Income>
) => {
  return firestore()
    .collection(`discord/${userId}/projects/${projectId}/incomes`)
    .add({ ...income, createdAt: dayjs().toISOString() })
}

export const deleteProjectIncome = (
  userId: string,
  projectId: string,
  incomeId: string
) => {
  return firestore()
    .collection(`discord/${userId}/projects/${projectId}/incomes`)
    .doc(incomeId)
    .delete()
}

export const updateProjectIncome = (
  userId: string,
  projectId: string,
  incomeId: string,
  income: Partial<Income>
) => {
  return firestore()
    .collection(`discord/${userId}/projects/${projectId}/incomes`)
    .doc(incomeId)
    .update({ ...income, updatesAt: dayjs().toISOString() })
}

const updateProjecttotalIncome = async (
  userId: string,
  projectId: string,
  totalIncome: number
) => {
  const projDoc = await firestore()
    .collection(`discord/${userId}/projects/`)
    .doc(projectId)
    .get()
  if (!projDoc.exists || !projDoc.data) {
    console.error(
      `Cannot add total to userId: ${userId}, projectId: ${projectId}, totalIncome: ${totalIncome}`
    )
  }
  return projDoc.ref.update({ totalIncome, updatedAt: dayjs().toISOString() })
}

export const getAllProjectsIncomes = async (
  userId: string,
  projectId: string
) => {
  try {
    const documents = await firestore()
      .collection(`discord/${userId}/projects/${projectId}/incomes`)
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

const incomeAdd = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  senderId: string
) => {
  let projectId = ''
  const newIncome: Partial<Income> = {
    createdAt: dayjs().toISOString(),
  }
  const date = dayjs()
  date.set('minute', 0)
  date.set('hour', 0)
  date.set('second', 0)
  date.date(1)
  options.forEach((element: any) => {
    if (element.name === 'hashtag') {
      projectId = element.value
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
    getAllProjectsIncomes(senderId, projectId).then((curIncomes) =>
      updateProjecttotalIncome(senderId, projectId, curIncomes.total + 1)
    ),
    createProjectIncome(senderId, projectId, newIncome),
    sendTxtLater(
      `Le revenue :\n${newIncome.status}: ${newIncome.ammount}\nA été ajouté au projet #${projectId}, 🎉!`,
      [],
      interaction.application_id,
      interaction.token
    ),
  ]).then(() => Promise.resolve())
}

const incomeEdit = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  senderId: string
) => {
  let projectId = ''
  let incomeId = ''
  const update: Partial<Income> = {
    updatedAt: dayjs().toISOString(),
  }
  const date = dayjs()
  date.set('minute', 0)
  date.set('hour', 0)
  date.set('second', 0)
  date.date(1)
  options.forEach((element: any) => {
    if (element.name === 'hashtag') {
      projectId = element.value
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
    updateProjectIncome(senderId, projectId, incomeId, update),
    sendTxtLater(
      `Le revenue ${incomeId} a été mise a jours dans le projet #${projectId}, 🎉!`,
      [],
      interaction.application_id,
      interaction.token
    ),
  ]).then(() => Promise.resolve())
}

const incomesView = async (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  senderId: string
) => {
  const projectId = option.value
  if (projectId) {
    const allTaks = await getAllProjectsIncomes(senderId, projectId)
    let incomeInfos = `Tu a fait ${allTaks.total} € sur ce projet, BRAVO 🎉!\n\nVoici La liste des revenus:\n`
    allTaks.incomes.forEach((element: any) => {
      incomeInfos += `${element.text} . Crée le ${dayjs(
        element.createdAt
      ).format('DD/MM/YYYY')}\n`
    })
    return sendTxtLater(
      incomeInfos,
      [],
      interaction.application_id,
      interaction.token
    )
  } else {
    return sendTxtLater(
      `Je ne trouve pas le projet ${projectId} 😅`,
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const incomesDelete = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  senderId: string
) => {
  let projectId = ''
  let incomeId = ''
  options.forEach((element: any) => {
    if (element.name === 'hashtag') {
      projectId = element.value
    } else if (element.name === 'id') {
      incomeId = element.value
    }
  })
  const curIncomes = await getAllProjectsIncomes(senderId, projectId)
  return Promise.all([
    deleteProjectIncome(senderId, projectId, incomeId),
    updateProjecttotalIncome(senderId, projectId, curIncomes.total),
    sendTxtLater(
      `Tu as supprimé le revenue ${incomeId} !`,
      [],
      interaction.application_id,
      interaction.token
    ),
  ]).then(() => Promise.resolve())
}

export const incomeFn = (
  interaction: any,
  option: ApplicationCommandInteractionDataOption,
  senderId: string
): Promise<void> => {
  if (
    option.name === 'ajouter' &&
    option.options &&
    option.options.length > 0
  ) {
    return incomeAdd(interaction, option.options, senderId)
  }
  if (option.name === 'liste' && option.options && option.options.length > 0) {
    return incomesView(interaction, option.options[0], senderId)
  }
  if (
    option.name === 'modifier' &&
    option.options &&
    option.options.length > 0
  ) {
    return incomeEdit(interaction, option.options, senderId)
  }
  if (
    option.name === 'supprimer' &&
    option.options &&
    option.options.length > 0
  ) {
    return incomesDelete(interaction, option.options, senderId)
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge`,
    [],
    interaction.application_id,
    interaction.token
  )
}
