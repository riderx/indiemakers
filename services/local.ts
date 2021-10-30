import { readdirSync } from 'fs'
import express, { json, Request, Response, Router } from 'express'
import * as dotenv from 'dotenv'
import initF from './firebase/init'

import { lateBot, morningBot } from './discord/bot/schedule'
import { onboardingMessage } from './discord/bot/utils'
import { getUsersById } from './firebase/discord'

dotenv.config()
const app = express()
const appRouter = Router()

const morning = async (_req: Request, res: Response) => {
  console.error('bot')
  initF()
  await morningBot()
  return res.status(200).end('Morning send')
}
const late = async (_req: Request, res: Response) => {
  console.error('bot')
  initF()
  await lateBot()
  return res.status(200).end('Late send')
}
const onboarding = async (_req: Request, res: Response) => {
  console.error('Onboarding')
  initF()
  const user = await getUsersById('309008240274964480')
  if (user) {
    await onboardingMessage(user)
  }
  return res.status(200).end('Onboarding send')
}
// app.use(express.json())
app.use((req, res, next) =>
  req.path.includes('bot')
    ? json({
        verify(req, _res, buf) {
          ;(req as any).rawBody = buf.toString()
        },
      })(req, res, next)
    : json()(req, res, next)
)

readdirSync('./api').forEach((file) => {
  if (!file.startsWith('.')) {
    // eslint-disable-next-line no-console
    console.log('Add api', file)
    if (file === 'bot') {
      appRouter.all(`/${file}`, require(`../api/${file}`).default)
    } else {
      appRouter.get(`/${file}`, require(`../api/${file}`).default)
    }
  }
})

appRouter.get('/morning', morning)
appRouter.get('/late', late)
appRouter.get('/onboarding', onboarding)

if (process.env.DEPLOY_API_ONLY) {
  app.use('/api', appRouter)
  app.use('/', (_req: Request, res: Response) => {
    res.redirect('/api')
  })
} else {
  app.use('/', appRouter)
}
export default app
