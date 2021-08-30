import { Request, Response } from 'express'
import fFnit from '../../services/firebase_init'
import { getAllUsers } from './../../services/discord/bot/user'
import { getAllAllPosts } from './../../services/discord/bot/post'

const list = async (_req: Request, res: Response) => {
  fFnit()
  const users = await getAllUsers()
  const posts = await getAllAllPosts(users)
  posts.sort((a, b) => (a.createdAt < b.createdAt === true ? 1 : -1))
  return res.json(posts)
}

export default list
