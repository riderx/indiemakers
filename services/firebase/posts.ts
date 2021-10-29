import dayjs from 'dayjs'
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

export const getPostById = async (userId: string, id: string): Promise<Post | null> => {
  try {
    const res = await getFirestore().collection(`discord/${userId}/posts`).doc(id.toLowerCase()).get()
    const data = res.data()
    return data !== undefined ? (data as Post) : null
  } catch (err) {
    console.error('getPostById', err)
    return null
  }
}

export const updatePost = async (userId: string, id: number, post: Partial<Post>): Promise<Post> => {
  const postDoc = await getFirestore().collection(`discord/${userId}/posts`).doc(String(id)).get()
  if (!postDoc.exists) {
    const newPost: Post = Object.assign(
      {
        hashtag: '',
        text: '',
        updatedAt: dayjs().toISOString(),
        createdAt: dayjs().toISOString(),
      },
      post
    )
    await getFirestore().collection(`discord/${userId}/posts`).doc(String(id)).set(newPost)
    return newPost
  }
  await postDoc.ref.update({ ...post, updatedAt: dayjs().toISOString() })
  return postDoc.data() as Post
}

export const deletePost = (userId: string, hashtag: string): Promise<any> => {
  return getFirestore().collection(`discord/${userId}/posts`).doc(hashtag.toLowerCase()).delete()
}

export const getLastPost = async (userId: string) => {
  const postList = await getFirestore()
    .collection(`discord/${userId}/posts`)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
  return postList[0]
}
