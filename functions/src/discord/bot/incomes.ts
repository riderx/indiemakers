import dayjs from 'dayjs'
import { getFirestore } from 'firebase-admin/firestore'
import { Income, IncomeAll, User } from './types'
import { getConfig, updateUser } from './discord'
import { sendChannel } from './utils'
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
