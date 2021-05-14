import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { verifyKey } from 'discord-interactions'
import feed from '../api/feed'
import sitemap from '../api/sitemap'
import rss from '../api/rss'
import healthcheck from '../api'
import makers from '../api/makers'
import ladder from '../api/ladder'
import community from '../api/community'
import ep from '../api/ep'
import discordInteraction from './discord/bot'

dotenv.config()

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
appRouter.get('/makers', makers)
appRouter.get('/community', community)
appRouter.get('/ladder', ladder)
appRouter.get('/ep', ep)
appRouter.post('/bot', async (req: Request, res: Response) => {
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
  return discordInteraction(req.body, res)
})
app.use('/', appRouter)

export default app
