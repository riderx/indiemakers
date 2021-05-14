import { Request, Response } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
const util = require('../../services/feed')
// const func = require('../../plugins/firebase_func')

const sitemap = async (_req: Request, res: Response) => {
  try {
    const smStream = new SitemapStream({ hostname: 'https://indiemakers.fr' })

    smStream.write({ url: '/tools', changefreq: 'monthly', priority: 0.1 })
    smStream.write({ url: '/makers', changefreq: 'daily', priority: 0.1 })
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
