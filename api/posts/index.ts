import { Request, Response } from 'express'
import initF from '../../services/firebase/init'
import { getAllUsers } from '../../services/firebase/discord'
import { getAllAllPosts } from '../../services/firebase/posts'
import dayjs from './../../services/dayjs'

const list = async (_req: Request, res: Response) => {
  initF()
  const users = await getAllUsers()
  const posts = await getAllAllPosts(users)
  posts.sort((a, b) => (a.createdAt < b.createdAt === true ? 1 : -1))
  posts.map((post) => {
    post.createdAt = dayjs(post.createdAt).fromNow()
    return post
  })
  return res.json(posts)
}

export default list
