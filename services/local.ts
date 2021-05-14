import express, { Request, Response } from 'express'
import admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
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
import { sendTxtLoading } from './discord/bot/utils'

dotenv.config()
if (!admin.apps.length) {
  admin.initializeApp()
} else {
  admin.app() // if already initialized, use that one
}
function getRawBody(req: Request): Promise<string> {
  return new Promise((resolve) => {
    const bodyChunks: Buffer[] = []
    req.on('end', () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8')
      resolve(rawBody)
    })
    req.on('data', (chunk) => bodyChunks.push(chunk))
  })
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
appRouter.all('/bot', async (req: Request, res: Response) => {
  const signature = String(req.headers['X-Signature-Ed25519']) || ''
  const timestamp = String(req.headers['X-Signature-Timestamp']) || ''
  const rawBody = await getRawBody(res as any)
  const isValidRequest = await verifyKey(
    rawBody,
    signature,
    timestamp,
    String(process.env.CLIENT_PUBLIC_KEY)
  )
  if (!isValidRequest) {
    return res.status(401).end('Bad request signature')
  }
  if (
    req.body &&
    req.body.type === InteractionType.APPLICATION_COMMAND &&
    req.body.data
  ) {
    await sendTxtLoading(res)
    return discordInteraction(req.body)
  }
  return res.send({
    type: InteractionResponseType.PONG,
  })
})
app.use('/', appRouter)

export default app
