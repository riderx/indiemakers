import { firestore } from 'firebase-admin'
import { Task, TaskAll } from '../types'

export const getLastTask = async (userId: string, hashtag: string) => {
  const taskList = await firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
  return taskList[0]
}

export const deleteProjectTask = (
  userId: string,
  hashtag: string,
  taskId: string
): Promise<any> => {
  return firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
    .doc(taskId)
    .delete()
}

export const getTask = (userId: string, hashtag:string) => {
  return firestore()
      .collection(`discord/${userId}/projects`)
      .doc(hashtag.toLowerCase())
      .get()
}

export const addTask = (userId: string, hashtag:string, doc: Partial<Task>) => {
  return firestore()
      .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
      .add(doc)
}
export const getOneProjectsTaskDoc = async (
  userId: string,
  hashtag: string,
  taskId: string
): Promise<FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData> | null> => {
  try {
    const snapshot = await firestore()
      .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
      .where('id', '==', parseInt(taskId))
      .limit(1)
      .get()
    return snapshot.docs[0]
  } catch (err) {
    console.error('getProjectById', err)
    return null
  }
}

export const getOneProjectsTask = async (
  userId: string,
  hashtag: string,
  taskId: string
): Promise<Task | null> => {
  try {
    const snapshot = await firestore()
      .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
      .where('id', '==', parseInt(taskId))
      .limit(1)
      .get()
    const curTask: Task = snapshot.docs[0].data() as Task
    return curTask
  } catch (err) {
    console.error('getProjectById', err)
    return null
  }
}

export const getAllProjectsTasks = async (
  userId: string,
  hashtag: string
): Promise<TaskAll> => {
  try {
    const documents = await firestore()
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
