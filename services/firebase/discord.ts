import { getFirestore } from 'firebase-admin/firestore'
import { User } from '../types'

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const documents = await getFirestore().collection('/discord').where('userId', '!=', null).get()
    const users: User[] = []
    documents.docs.forEach((doc) => {
      const data: User = doc.data() as User
      if (data !== undefined) {
        users.push(data)
      }
    })
    return users
  } catch (err) {
    console.error('getAllUsers', err)
    return []
  }
}

export const getUsersByUsername = async (username: string): Promise<User | null> => {
  try {
    const snapshot = await getFirestore().collection('/discord').where('username', '==', username).get()
    let data
    snapshot.forEach((doc) => {
      data = doc.data()
    })
    return data !== undefined ? (data as User) : null
  } catch (err) {
    console.error('getUsersById', err)
    return null
  }
}
