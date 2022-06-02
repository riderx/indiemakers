import { Request, Response } from 'express'
import { getFirestore } from 'firebase-admin/firestore'
import initF from '../../services/firebase/init'
import { getPostsByHash } from '../../services/firebase/posts'
import { getAllProjectsTasks } from '../../services/firebase/tasks'
import { Income, IncomeAll, Project, User } from '../../services/types'
import { getUsersByUsername, getAllUsers } from './../../services/firebase/discord'

const getAllProjectsIncomes = async (userId: string, hashtag: string): Promise<IncomeAll> => {
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

const getProjectById = async (userId: string, hashtag: string): Promise<Project | null> => {
  try {
    const res = await getFirestore().collection(`discord/${userId}/projects`).doc(hashtag.toLowerCase()).get()
    const data = res.data()
    return data !== undefined ? (data as Project) : null
  } catch (err) {
    console.error('getProjectById', err)
    return null
  }
}

const getAllProjects = async (userId: string, userName: string | undefined = undefined): Promise<Project[]> => {
  try {
    const documents = await getFirestore().collection(`discord/${userId}/projects`).where('hashtag', '!=', null).get()

    const projects: Project[] = []
    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      const data = (await doc.data()) as Project
      if (data !== undefined && data.hashtag && data.hashtag !== '') {
        projects.push({ userId, userName, id: doc.id, ...(data as Project) })
      }
    }
    return projects
  } catch (err) {
    console.error('getAllProjects', err)
    return []
  }
}
const getAllAllProject = async (users: User[]): Promise<Project[]> => {
  const arrays: Project[][] = await Promise.all(
    users.map((usr: User) => {
      return getAllProjects(String(usr?.userId), usr?.username)
    })
  )
  const projects: Project[] = arrays.reduce((a, b) => a.concat(b), [])
  return projects
}

const project = async (req: Request, res: Response) => {
  initF()
  if (req?.query?.hashtag) {
    const user = await getUsersByUsername(String(req.query.id))
    if (user) {
      const proj = await getProjectById(String(user?.userId), String(req.query.hashtag))
      const posts = await getPostsByHash(user, String(req.query.hashtag))
      const tasks = await getAllProjectsTasks(String(user?.userId), String(req.query.hashtag))
      const incomes = await getAllProjectsIncomes(String(user?.userId), String(req.query.hashtag))
      if (proj) {
        proj.userId = user.userId
        proj.userName = user.username || user.userId
        proj.tasksData = tasks
        proj.postsData = posts
        proj.incomesData = incomes
        proj.isStripe = !!proj.stripeApiKey
        res.json(proj)
      } else {
        res.json({ error: 'not found' })
      }
    }
  } else {
    try {
      const users = await getAllUsers()
      const projects = await getAllAllProject(users)
      res.json(
        projects.filter(
          (project) => project.userName && (project.postsData?.total || project.tasks > 5 || project.incomes) && project.description
        )
      )
    } catch (err) {
      res.json({ error: String(err) })
    }
  }
}
export default project
