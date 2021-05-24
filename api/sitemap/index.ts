import { Request, Response } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
import { getAllUsers } from '../../services/discord/bot/user'
// const func = require('../../plugins/firebase_func')
import fFnit from '../../services/firebase_init'
const { $content } = require('@nuxt/content')
const util = require('../../services/feed')

const sitemap = async (_req: Request, res: Response) => {
  try {
    fFnit()
    const smStream = new SitemapStream({ hostname: 'https://indiemakers.fr' })

    smStream.write({ url: '/tools', changefreq: 'monthly', priority: 0.1 })
    smStream.write({ url: '/makers', changefreq: 'daily', priority: 0.1 })
    smStream.write({ url: '/communaute', changefreq: 'daily', priority: 0.1 })
    smStream.write({ url: '/articles', changefreq: 'daily', priority: 1 })
    const eps = await util.feed()
    // const results = await func.run('getMakers')
    let prio = 1.0

    eps.forEach((element: any) => {
      smStream.write({
        url: `/episode/${element.id}`,
        changefreq: 'daily',
        priority: prio,
      })
      prio = prio / 2
    })
    const data = await getAllUsers()
    data.users.forEach((user) => {
      smStream.write({
        url: `/communaute/${user.username}`,
        changefreq: 'daily',
        priority: 0.5,
      })
    })

    const articles = await $content('articles').fetch()

    articles.forEach((article: any) => {
      smStream.write({
        url: `/articles/${article.slug}`,
        changefreq: 'daily',
        priority: 0.5,
      })
    })
    // results.forEach((element) => {
    //   smStream.write({ url: `/makers/${element.login}`, changefreq: 'daily', priority: 0.1 })
    // })
    // Indie Makers Are Taking Back The Web One App At A Time
    // les indie maker conquerissent le web une app a la fois
    // les-indie-maker-conquerissent-le-web-une-app-a-la-fois
    smStream.end()
    streamToPromise(smStream).then((data: any) => res.send(data.toString()))
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export default sitemap
