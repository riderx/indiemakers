import { Request, Response } from 'express'
import { getFirestore } from 'firebase-admin/firestore'
import { getAllUsers, getUsersByUsername } from '../../services/firebase/discord'
import { getAllPosts } from '../../services/firebase/posts'
import initF from '../../services/firebase/init'
import { Project } from '~/services/types'

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

const makers = async (req: Request, res: Response) => {
  initF()
  if (req?.query?.id) {
    const user = await getUsersByUsername(String(req.query.id))
    const projects = await getAllProjects(String(user?.userId), user?.username)
    const posts = user ? await getAllPosts(user) : []
    if (user) {
      user.projectsData = projects
      user.postsData = posts
      ;(user as any).makerlogHook = !!user.makerlogHook
      ;(user as any).wipApiKey = !!user.wipApiKey
    }
    res.json(user)
  } else {
    const users = await getAllUsers()
    users.forEach((user) => {
      user.makerlogHook = ''
      user.wipApiKey = ''
    })
    return res.json(users.filter((user) => user.posts || user.tasks > 10 || user.karma > 15))
  }
}
export default makers
