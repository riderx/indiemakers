import fs from 'fs'
import { Request, Response } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
import fFnit from '../../services/firebase/init'
import { feed } from '../../services/feed'
import { getAllUsers } from './../../services/firebase/discord'
import { getAllAllProject } from './../../services/discord/bot/project'

const getArticles = async () => {
  const files = await fs.readdirSync(`${__dirname}/../../content/articles`)
  return files.map((file) => ({ slug: file.replace('.md', '').replace(/-/g, '_') }))
}

const sitemap = async (_req: Request, res: Response) => {
  try {
    fFnit()
    const smStream = new SitemapStream({ hostname: 'https://indiemakers.fr' })

    smStream.write({ url: '/tools', changefreq: 'monthly', priority: 0.1 })
    smStream.write({ url: '/makers', changefreq: 'daily', priority: 0.5 })
    smStream.write({ url: '/articles', changefreq: 'daily', priority: 1 })
    const eps = await feed()
    let prio = 1.0

    eps.forEach((element: any) => {
      smStream.write({
        url: `/episode/${element.id}`,
        changefreq: 'daily',
        priority: prio,
      })
      prio = prio / 2
    })
    const users = await getAllUsers()
    const projects = await getAllAllProject(users)
    users.forEach((user) => {
      smStream.write({
        url: `/makers/${encodeURI(user.username)}`,
        changefreq: 'daily',
        priority: 0.5,
      })
    })
    projects.forEach((project) => {
      if (project.userName) {
        smStream.write({
          url: `/makers/${encodeURI(project.userName)}/projets/${project.hashtag}`,
          changefreq: 'daily',
          priority: 0.5,
        })
      }
    })
    // const articles = await $content('articles').fetch()
    const articles = await getArticles()

    articles.forEach((article: any) => {
      smStream.write({
        url: `/articles/${article.slug}`,
        changefreq: 'daily',
        priority: 0.5,
      })
    })
    smStream.end()
    const data = await streamToPromise(smStream)
    return res.send(data.toString())
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export default sitemap
