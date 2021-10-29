import { getFirestore } from 'firebase-admin/firestore'
import dayjs from 'dayjs'
import { User } from '../types'
import { getAllProjects } from '../discord/bot/project'

export const updateUser = async (userId: string): Promise<Partial<User> | undefined> => {
  try {
    const projects = await getAllProjects(userId)
    const posts = await getFirestore().collection(`discord/${userId}/posts`).orderBy('id', 'desc').get()
    const res = projects.reduce(
      (acc, project) => {
        return {
          tasks: acc.tasks + (project.tasks || 0),
          incomes: acc.incomes + (project.incomes || 0),
          streak: acc.streak > (project.streak || 0) ? acc.streak : project.streak || 0,
          bestStreak: acc.bestStreak > (project.bestStreak || 0) ? acc.bestStreak : project.bestStreak || 0,
        }
      },
      {
        tasks: 0,
        incomes: 0,
        streak: 0,
        bestStreak: 0,
      }
    )

    const base: Partial<User> = {
      ...res,
      projects: projects.length,
      posts: posts.docs.length,
      updatedAt: dayjs().toISOString(),
    }
    await getFirestore().collection('discord').doc(userId).update(base)
    return base
  } catch (err) {
    console.error('updateUser', err, userId)
    return undefined
  }
}

export const fixAllUsersDeep = async () => {
  try {
    const documents = await getFirestore().collection('/discord').get()

    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      if (doc.exists) {
        // eslint-disable-next-line no-console
        console.log('doc.id', doc.id)
        const res = await updateUser(doc.id)
        // eslint-disable-next-line no-console
        console.log('doc.id updated', doc.id, res)
      }
    }
    // eslint-disable-next-line no-console
    console.log('updateUser done')
  } catch (err) {
    console.error('getAllUsers', err)
    return []
  }
}
