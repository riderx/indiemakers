const bodyParser = require('body-parser')
const express = require('express')
const ExpressCache = require('express-cache-middleware')
const cacheManager = require('cache-manager')
const redisStore = require('cache-manager-redis')
const feed = require('./api/feed')
const healthcheck = require('./api')
const maker = require('./api/maker/[guid]')
const ep = require('./api/ep/[guid]')
const isServerlessEnvironment = process.env.NEXT_PUBLIC_VERCEL_URL === 'true'

const app = express()
const appRouter = express.Router()

if (process.env.redis_host) {
  const redisCache = cacheManager.caching({
    store: redisStore,
    host: process.env.redis_host,
    port: process.env.redis_port,
    auth_pass: process.env.redis_pass,
    db: 0,
    ttl: 3600
  })
  const cacheMiddleware = new ExpressCache(redisCache)
  cacheMiddleware.attach(app)
}
app.use(bodyParser.json())

const prefix = isServerlessEnvironment ? '/api' : ''

appRouter.get('/feed', feed)
appRouter.get('/healthcheck', healthcheck)
appRouter.get('/makers/:guid', maker)
appRouter.get('/ep/:guid', ep)
app.use(`/${prefix}`, appRouter)

module.exports = app
