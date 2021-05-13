import express from 'express'
import * as dotenv from 'dotenv'
import feed from './api/feed'
import sitemap from './api/sitemap'
import rss from './api/rss'
import healthcheck from './api'
import makers from './api/makers'
import discordMakers from './api/discord_makers'
import ep from './api/ep'

dotenv.config()

// if (process.env.GOOGLE_SERVICE_ACCOUNT) {
//   initializeApp({
//     credential: credential.cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)),
//     databaseURL: 'https://indiemakerfr.firebaseio.com',
//   })
// } else {
//   Error('Missing api key')
// }
const app = express()
const appRouter = express.Router()

app.use(express.json())

appRouter.get('/feed', feed)
appRouter.get('/sitemap.xml', sitemap)
appRouter.get('/rss.xml', rss)
appRouter.get('/', healthcheck)
appRouter.get('/makers', makers)
appRouter.get('/discord_makers', discordMakers)
appRouter.get('/ep', ep)
app.use('/', appRouter)

export default app
