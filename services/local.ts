import express, { Request, Response } from 'express'
import admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions'
import feed from '../api/feed'
import sitemap from '../api/sitemap'
import rss from '../api/rss'
import healthcheck from '../api'
import makershunt from '../api/makershunt'
import maker from '../api/maker'
import project from '../api/project'
import community from '../api/community'
import ep from '../api/ep'
import discordInteraction from './discord/bot'
import { sendTxtLater, sendTxtLoading } from './discord/bot/utils'

dotenv.config()
if (!admin.apps.length) {
  admin.initializeApp()
} else {
  admin.app() // if already initialized, use that one
}
const app = express()
const appRouter = express.Router()

app.use(express.json())
appRouter.get('/feed', feed)
appRouter.get('/sitemap.xml', sitemap)
appRouter.get('/rss.xml', rss)
appRouter.get('/', healthcheck)
appRouter.get('/makershunt', makershunt)
appRouter.get('/community', community)
appRouter.get('/maker', maker)
appRouter.get('/project', project)
appRouter.get('/ep', ep)
appRouter.all(
  '/bot',
  verifyKeyMiddleware(String(process.env.CLIENT_PUBLIC_KEY)),
  async (req: Request, res: Response) => {
    if (
      req.body &&
      req.body.type === InteractionType.APPLICATION_COMMAND &&
      req.body.data
    ) {
      await sendTxtLoading(res)
      try {
        await discordInteraction(req.body)
      } catch (err) {
        await sendTxtLater(
          `La Commande ${req.body.data.name} a echoué`,
          [],
          req.body.application_id,
          req.body.token
        )
      }
      return
    }
    return res.send({
      type: InteractionResponseType.PONG,
    })
  }
)
app.use('/', appRouter)

export default app
