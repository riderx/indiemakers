import { getFirestore } from 'firebase-admin/firestore'
import { User, Post, PostAll } from '../types'

export const getAllPosts = async (user: Partial<User>): Promise<Post[]> => {
  try {
    const documents = await getFirestore().collection(`discord/${user.userId}/posts`).orderBy('id', 'desc').get()

    const posts: Post[] = []
    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      const data = (await doc.data()) as Post
      if (data !== undefined) {
        posts.push({
          userId: user.userId,
          userName: user.name || user.username || '',
          userAvatarUrl: user.avatarUrl || '',
          id: Number(doc.id),
          ...(data as Post),
        })
      }
    }
    return posts
  } catch (err) {
    console.error('getAllPosts', err)
    return []
  }
}

export const getAllAllPosts = async (users: User[]): Promise<Post[]> => {
  const arrays: Post[][] = await Promise.all(
    users.map((usr: User) => {
      return getAllPosts(usr)
    })
  )
  const posts: Post[] = arrays.reduce((a, b) => a.concat(b), [])
  return posts
}

export const getPostsByHash = async (user: Partial<User>, hashtag: string): Promise<PostAll> => {
  const posts: Post[] = []
  try {
    const documents = await getFirestore()
      .collection(`discord/${user.userId}/posts`)
      .orderBy('id', 'desc')
      .where('hashtag', '==', hashtag)
      .get()
    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      const data = (await doc.data()) as Post
      if (data !== undefined) {
        posts.push({
          userId: user.userId,
          userName: user.name || user.username || '',
          userAvatarUrl: user.avatarUrl || '',
          id: Number(doc.id),
          ...(data as Post),
        })
      }
    }
    return { posts, total: posts.length }
  } catch (err) {
    console.error('getPostsByHash', err)
    return { posts, total: posts.length }
  }
}
