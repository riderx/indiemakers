import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import podcasts from '../api/podcasts'
import bot from '../api/bot'
import sitemap from '../api/sitemap'
import rss from '../api/rss'
import makershunt from '../api/makershunt'
import makers from '../api/makers'
import posts from '../api/posts'
import tools from '../api/tools'
import project from '../api/project'
import { lateBot, morningBot } from './discord/bot/schedule'

dotenv.config()
const app = express()
const appRouter = express.Router()

const morning = async (_req: Request, res: Response) => {
  console.error('bot')
  await morningBot()
  return res.status(200).end('Morning send')
}
const late = async (_req: Request, res: Response) => {
  console.error('bot')
  await lateBot()
  return res.status(200).end('Late send')
}
app.use(express.json())
appRouter.get('/podcasts', podcasts)
appRouter.get('/sitemap.xml', sitemap)
appRouter.get('/rss.xml', rss)
appRouter.get('/makershunt', makershunt)
appRouter.get('/tools', tools)
appRouter.get('/makers', makers)
appRouter.get('/posts', posts)
appRouter.get('/project', project)
appRouter.all('/bot', bot)
appRouter.get('/morning', morning)
appRouter.get('/late', late)

if (process.env.DEPLOY_API_ONLY) {
  app.use('/api', appRouter)
  app.use('/', (_req: Request, res: Response) => {
    res.redirect('/api')
  })
} else {
  app.use('/', appRouter)
}
export default app
