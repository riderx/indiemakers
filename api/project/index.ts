import { Request, Response } from 'express'
import { getProjectById } from '../../services/discord/bot/project'
import { getAllProjectsIncomes } from '../../services/discord/bot/income'
import { getAllProjectsTasks } from '../../services/discord/bot/tasks'

const project = async (req: Request, res: Response) => {
  if (req?.query?.id) {
    const proj = await getProjectById(
      String(req.query.uid),
      String(req.query.id)
    )
    const tasks = await getAllProjectsTasks(
      String(req.query.uid),
      String(req.query.id)
    )
    const income = await getAllProjectsIncomes(
      String(req.query.uid),
      String(req.query.id)
    )
    if (proj) {
      ;(proj as any).tasksData = tasks
      ;(proj as any).incomeData = income
      proj.stripeKey = ''
      res.json(proj)
    } else {
      res.json({ error: 'not found' })
    }
  } else {
    res.json({ error: 'not found' })
  }
}
export default project
