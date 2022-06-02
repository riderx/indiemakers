import dayjs from 'dayjs'
import { getFirestore } from 'firebase-admin/firestore'
import getMetaData from 'metadata-scraper'
import { Project, User } from './types'
import { getConfig } from './discord'
import { TwitterApiToken, useTwitter } from './twitter'
import { openChannel, sendChannel } from './utils'

const twitter = useTwitter(process.env.TWITTER_TOKEN ? (JSON.parse(process.env.TWITTER_TOKEN) as TwitterApiToken) : undefined)

export const getAllProjects = async (userId: string, userName: string | undefined = undefined): Promise<Project[]> => {
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

export const getAllAllProject = async (users: User[]): Promise<Project[]> => {
  const arrays: Project[][] = await Promise.all(
    users.map((usr: User) => {
      return getAllProjects(String(usr?.userId), usr?.username)
    })
  )
  const projects: Project[] = arrays.reduce((a, b) => a.concat(b), [])
  return projects
}

export const getProjectById = async (userId: string, hashtag: string): Promise<Project | null> => {
  try {
    const res = await getFirestore().collection(`discord/${userId}/projects`).doc(hashtag.toLowerCase()).get()
    const data = res.data()
    return data !== undefined ? (data as Project) : null
  } catch (err) {
    console.error('getProjectById', err)
    return null
  }
}

export const updateProject = async (userId: string, hashtag: string, project: Partial<Project>): Promise<Project> => {
  const lowHash = hashtag.toLowerCase()
  const projDoc = await getFirestore().collection(`discord/${userId}/projects`).doc(lowHash).get()
  if (!projDoc.exists) {
    const newProject: Project = Object.assign(
      {
        hashtag: '',
        name: '',
        description: '',
        category: '',
        website: '',
        logo: '',
        cover: '',
        emoji: '',
        color: '',
        tasks: 0,
        streak: 0,
        bestStreak: 0,
        incomes: 0,
        updatedAt: dayjs().toISOString(),
        createdAt: dayjs().toISOString(),
      },
      project
    )
    await getFirestore().collection(`discord/${userId}/projects`).doc(lowHash).set(newProject)
    return newProject
  }
  if (project.website) {
    try {
      const data = await getMetaData(project.website)
      if (!project.name && data.title) {
        project.name = data.title
      }
      if (!project.cover && data.image) {
        project.cover = data.image
      }
      if (!project.logo && data.icon) {
        project.logo = data.icon
      }
      if (!project.description && data.description) {
        project.description = data.description
      }
    } catch (err) {
      console.error('getMetaData', err, project.website)
    }
  }
  if (project.twitter) {
    try {
      const data = await twitter.user(project.twitter.split('/').pop() || '')
      if (!project.name && data.name) {
        project.name = data.name
      }
      if (!project.cover && data.profile_banner_url) {
        project.cover = data.profile_banner_url
      }
      if (!project.logo && data.profile_image_url_https) {
        project.logo = data.profile_image_url_https
      }
      if (!project.description && data.description) {
        project.description = data.description
      }
    } catch (err) {
      console.error('twitter', err, project.twitter)
    }
  }
  const data: Project = projDoc.data() as Project
  if (!data.name && project.name) {
    const config = await getConfig()
    const channel = await openChannel(userId)
    console.error('channel', channel)
    await sendChannel(
      channel.id,
      `💗 Il est temps d'envoyer 💌 ta première tâche au projet #${lowHash} avec:
\`/im tache ajouter hashtag:${lowHash} contenu:Ajout du projet sur INDIE MAKERS\`
Fait le sur le salon <#${config.channel_bip}>, il est fait pour ça, il est en silencieux pour tout le monde !`
    )
  }
  await projDoc.ref.update({ ...project, updatedAt: dayjs().toISOString() })
  return projDoc.data() as Project
}

export const deleteAllProjectsTasks = async (userId: string, hashtag: string): Promise<void> => {
  try {
    const documents = await getFirestore().collection(`discord/${userId}/projects/${hashtag}/tasks`).get()
    const listDel: any[] = []
    documents.docs.forEach((doc) => {
      listDel.push(doc.ref.delete())
    })
    await Promise.all(listDel)
    return Promise.resolve()
  } catch (err) {
    console.error('deleteAllProjectsTasks', err)
    return Promise.resolve()
  }
}
