import { getFirestore } from 'firebase-admin/firestore'
import { Task, TaskAll } from '../types'

export const getAllProjectsTasks = async (userId: string, hashtag: string): Promise<TaskAll> => {
  try {
    const documents = await getFirestore()
      .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
      .orderBy('id', 'desc')
      .get()
    const tasks: Task[] = []
    documents.docs.map((doc) => {
      const data = doc.data() as Task
      if (data !== undefined) {
        tasks.push({ ...data })
      }
      return data
    })
    return { tasks, total: tasks.length }
  } catch (err) {
    console.error('getAllProjectsTasks', err)
    return { tasks: [], total: 0 }
  }
}
