import Stripe from 'stripe'
import dayjs, { Dayjs } from 'dayjs'
import { getAllUsers, User } from './user'
import { getAllProjects, Project } from './project'
import { getAllProjectsIncomes, Income, updateProjectIncome } from './incomes'

// create restricted key here:https://dashboard.stripe.com/apikeys
// with only charges read scope
export interface Charge {
  stripeId: string
  date: string
  status: 'expense' | 'income'
  ammount: number
}
interface QueryStripe {
  // eslint-disable-next-line camelcase
  starting_after?: string
  limit: number
}

const secondsToISOString = (seconds: number) => {
  const date = new Date(seconds * 1000)
  return date.toISOString()
}

const convertAmmount = (ammount: number) => {
  return ammount / 100
}

const iterateCharges = (
  apiRes: Stripe.ApiList<Stripe.Charge>,
  startDate: Dayjs,
  endDate: Dayjs
): Charge[] => {
  const allCharges: Charge[] = []
  apiRes.data.forEach((charge: Stripe.Charge) => {
    const curDate = dayjs(secondsToISOString(charge.created))
    const ammount = convertAmmount(
      charge.amount_captured - charge.amount_refunded
    )
    const status = ammount >= 0 ? 'income' : 'expense'
    if (dayjs(curDate).isAfter(startDate) && dayjs(curDate).isBefore(endDate)) {
      allCharges.push({
        stripeId: charge.id,
        date: curDate.toISOString(),
        status,
        ammount: Math.abs(ammount),
      })
    }
  })
  return allCharges
}

export const getStripeCharges = async (
  key: string,
  startDate = dayjs('2010-01-01'),
  endDate = dayjs()
) => {
  const stripe = new Stripe(key, {
    apiVersion: '2020-08-27',
  })
  let hasMore = true
  let startingAfter = null
  let startingAfterDate = dayjs()
  const allCharges: Charge[] = []
  while (hasMore && dayjs(startDate).isBefore(startingAfterDate)) {
    const query: QueryStripe = {
      limit: 10,
    }
    if (startingAfter) {
      query.starting_after = startingAfter
    }
    const charges = await stripe.charges.list(query)
    allCharges.push(...iterateCharges(charges, startDate, endDate))
    hasMore = charges.has_more
    startingAfter = charges.data[charges.data.length - 1].id
    startingAfterDate = dayjs(
      secondsToISOString(charges.data[charges.data.length - 1].created)
    )
  }
  return allCharges
}

const getAllUsersAndProjects = async () => {
  const res = await getAllUsers()
  const allUsers: { [key: string]: User } = {}
  for (let index = 0; index < res.users.length; index++) {
    const user = res.users[index]
    if (allUsers[user.userId]) {
      allUsers[user.userId] = {
        ...user,
      }
      const projects = allUsers[user.userId].projectsData
      if (projects) {
        allUsers[user.userId].projectsData = projects.concat(
          await getAllProjects(user.userId)
        )
      } else {
        allUsers[user.userId].projectsData = await getAllProjects(user.userId)
      }
    } else {
      allUsers[user.userId] = {
        ...user,
        projectsData: await getAllProjects(user.userId),
      }
    }
  }
  return allUsers
}

const mixIncomeCharges = async (
  userId: string,
  project: Project,
  startMonth: dayjs.Dayjs
) => {
  if (!project.stripeKey || !project.id) return undefined
  return {
    userId,
    projectId: project.id,
    charges: await getStripeCharges(project.stripeKey, startMonth),
    incomes: (await getAllProjectsIncomes(userId, project.id)).incomes,
  }
}

const foundIncome = (incomes: Income[], dateKey: string): Income | null => {
  for (let index = 0; index < incomes.length; index++) {
    const income = incomes[index]
    if (dayjs(income.date).format('MM_YYYY') === dateKey) {
      return income
    }
  }
  return null
}

const updateCurrentIcome = (
  data:
    | {
        userId: string
        projectId: string
        charges: Charge[]
        incomes: Income[]
      }
    | undefined
) => {
  if (!data) return null
  const dateKey = dayjs(data.charges[0].date).format('MM_YYYY')
  const income = foundIncome(data.incomes, dateKey)
  if (income && income.id) {
    income.ammount = 0
    income.stripeCharges = []
    for (let index = 0; index < data.charges.length; index++) {
      const charge = data.charges[index]
      income.stripeCharges?.push(charge)
      if (charge.status === 'income') {
        income.ammount += charge.ammount
      } else {
        income.ammount -= charge.ammount
      }
    }
    return updateProjectIncome(data.userId, data.projectId, income.id, income)
  }
  return null
}

export const updateRevenueAllProject = async () => {
  const allUsers = await getAllUsersAndProjects()
  const all: Promise<any>[] = []
  const startMonth = dayjs()
  startMonth.date(1)
  Object.keys(allUsers).forEach((userId: string) => {
    const user = allUsers[userId]
    if (!user.projectsData) return userId
    for (let index = 0; index < user.projectsData.length; index++) {
      const project = user.projectsData[index]
      if (!project.id) break
      if (project.stripeKey) {
        all.push(
          mixIncomeCharges(userId, project, startMonth).then(updateCurrentIcome)
        )
      }
    }
    return userId
  })
  return Promise.all(all).then(() => Promise.resolve())
}
