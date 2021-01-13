const bodyParser = require('body-parser')
const express = require('express')
const feed = require('./api/feed/index')
const sitemap = require('./api/sitemap/index')
const healthcheck = require('./api/index')
const makers = require('./api/makers/index')
const ep = require('./api/ep/index')
const isServerlessEnvironment = process.env.VERCEL_URL === 'true'

const app = express()
const appRouter = express.Router()

app.use(bodyParser.json())

const prefix = isServerlessEnvironment ? '/api' : ''

appRouter.get('/feed', feed)
appRouter.get('/sitemap.xml', sitemap)
appRouter.get('/', healthcheck)
appRouter.get('/makers', makers)
appRouter.get('/ep', ep)
app.use(`/${prefix}`, appRouter)

module.exports = app
