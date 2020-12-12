const bodyParser = require('body-parser')
const express = require('express')
const feed = require('./api/feed/index')
const healthcheck = require('./api/index')
const maker = require('./api/maker/index')
const ep = require('./api/ep/index')
const isServerlessEnvironment = process.env.VERCEL_URL === 'true'

const app = express()
const appRouter = express.Router()

app.use(bodyParser.json())

const prefix = isServerlessEnvironment ? '/api' : ''

appRouter.get('/feed', feed)
appRouter.get('/', healthcheck)
appRouter.get('/maker', maker)
appRouter.get('/ep', ep)
app.use(`/${prefix}`, appRouter)

module.exports = app
