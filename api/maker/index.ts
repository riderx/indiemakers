import { Request, Response } from 'express'
import { getAllProjects } from '../../services/discord/bot/project'
import { getUsersByUsername } from '../../services/discord/bot/user'
import fFnit from '../../services/firebase_init'
import { getAllPosts } from './../../services/discord/bot/post'

const maker = async (req: Request, res: Response) => {
  if (req?.query?.id) {
    fFnit()
    const user = await getUsersByUsername(String(req.query.id))
    const projects = await getAllProjects(String(user?.userId))
    const posts = user ? await getAllPosts(user) : []
    if (user) {
      user.projectsData = projects
      user.postsData = posts
      ;(user as any).makerlogHook = !!user.makerlogHook
      ;(user as any).wipApiKey = !!user.wipApiKey
    }
    res.json(user)
  } else {
    res.json({ error: 'not found' })
  }
}
export default maker
