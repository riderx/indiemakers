import { Request, Response } from 'express'
import { getAllProjects } from '../../services/discord/bot/project'
import { getUsersById } from '../../services/discord/bot/user'

const maker = async (req: Request, res: Response) => {
  if (req?.query?.id) {
    const user = await getUsersById(String(req.query.id))
    const projects = await getAllProjects(String(req.query.id))
    if (user) {
      user.projectsData = projects
      ;(user as any).makerlogHook = !!user.makerlogHook
      ;(user as any).wipApiKey = !!user.wipApiKey
    }
    res.json(user)
  } else {
    res.json({ error: 'not found' })
  }
}
export default maker
