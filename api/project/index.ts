import { Request, Response } from 'express'
import { getAllAllProject, getProjectById } from '../../services/discord/bot/project'
import { getAllProjectsIncomes } from '../../services/discord/bot/incomes'
import initF from '../../services/firebase/init'
import { getPostsByHash } from '../../services/firebase/posts'
import { getAllProjectsTasks } from '../../services/firebase/tasks'
import { getUsersByUsername, getAllUsers } from './../../services/firebase/discord'

const project = async (req: Request, res: Response) => {
  initF()
  if (req?.query?.hashtag) {
    const user = await getUsersByUsername(String(req.query.id))
    if (user) {
      const proj = await getProjectById(String(user?.userId), String(req.query.hashtag))
      const posts = await getPostsByHash(user, String(req.query.hashtag))
      const tasks = await getAllProjectsTasks(String(user?.userId), String(req.query.hashtag))
      const incomes = await getAllProjectsIncomes(String(user?.userId), String(req.query.hashtag))
      if (proj) {
        proj.userId = user.userId
        proj.userName = user.username || user.userId
        proj.tasksData = tasks
        proj.postsData = posts
        proj.incomesData = incomes
        proj.isStripe = !!proj.stripeApiKey
        res.json(proj)
      } else {
        res.json({ error: 'not found' })
      }
    }
  } else {
    try {
      const users = await getAllUsers()
      const projects = await getAllAllProject(users)
      res.json(
        projects.filter(
          (project) => project.userName && (project.postsData?.total || project.tasks > 5 || project.incomes > 1) && project.description
        )
      )
    } catch (err) {
      res.json({ error: String(err) })
    }
  }
}
export default project
