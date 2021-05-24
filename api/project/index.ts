import { Request, Response } from 'express'
import {
  getAllProjects,
  getProjectById,
  Project,
} from '../../services/discord/bot/project'
import { getAllProjectsIncomes } from '../../services/discord/bot/incomes'
import { getAllProjectsTasks } from '../../services/discord/bot/tasks'
import fFnit from '../../services/firebase_init'
import { getAllUsers, User } from '../../services/discord/bot/user'

const project = async (req: Request, res: Response) => {
  fFnit()
  if (req?.query?.id) {
    const proj = await getProjectById(
      String(req.query.uid),
      String(req.query.id)
    )
    const tasks = await getAllProjectsTasks(
      String(req.query.uid),
      String(req.query.id)
    )
    const incomes = await getAllProjectsIncomes(
      String(req.query.uid),
      String(req.query.id)
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
      const usrTt = await getAllUsers()
      const arrays: Project[][] = await Promise.all(
        usrTt.users.map((usr: User) => {
          return getAllProjects(String(usr?.userId))
        })
      )
      const projects: Project[] = arrays.reduce((a, b) => a.concat(b), [])
      res.json({ projects })
    } catch (err) {
      res.json({ error: String(err) })
    }
  }
}
export default project
