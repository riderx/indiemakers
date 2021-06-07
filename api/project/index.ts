import { Request, Response } from 'express'
import {
  getAllAllProject,
  getProjectById,
} from '../../services/discord/bot/project'
import { getAllProjectsIncomes } from '../../services/discord/bot/incomes'
import { getAllProjectsTasks } from '../../services/discord/bot/tasks'
import fFnit from '../../services/firebase_init'
import { getAllUsers } from '~/services/discord/bot/user'

const project = async (req: Request, res: Response) => {
  fFnit()
  if (req?.query?.hashtag) {
    const proj = await getProjectById(
      String(req.query.uid),
      String(req.query.hashtag)
    )
    const tasks = await getAllProjectsTasks(
      String(req.query.uid),
      String(req.query.hashtag)
    )
    const incomes = await getAllProjectsIncomes(
      String(req.query.uid),
      String(req.query.hashtag)
    )
    if (proj) {
      ;(proj as any).tasksData = tasks
      ;(proj as any).incomesData = incomes
      ;(proj as any).stripeApiKey = !!proj.stripeApiKey
      res.json(proj)
    } else {
      res.json({ error: 'not found' })
    }
  } else {
    try {
      const users = await getAllUsers()
      const projects = await getAllAllProject(users)
      res.json({ projects })
    } catch (err) {
      res.json({ error: String(err) })
    }
  }
}
export default project
