import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
import initF from '../../services/firebase/init'
import { feed } from '../../services/feed'
import { getAllUsers } from './../../services/firebase/discord'
import { getAllAllProject } from './../../services/discord/bot/project'

const getArticles = () => {
  const files = fs.readdirSync(path.join(__dirname, '..', '..', 'content', 'articles'))
  return files.map((file) => ({ slug: file.replace('.md', '').replace(/-/g, '_') }))
}

const sitemap = async (_req: Request, res: Response) => {
  try {
    initF()
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
      if ((user.incomes || user.posts || user.tasks > 10 || user.karma > 15) && user.bio) {
        smStream.write({
          url: `/makers/${encodeURIComponent(user.username)}`,
          changefreq: 'daily',
          priority: 0.5,
        })
      }
    })
    projects.forEach((project) => {
      if (project.userName && (project.incomes || project.postsData?.total || project.tasks > 5) && project.description) {
        smStream.write({
          url: `/makers/${encodeURIComponent(project.userName)}/projets/${encodeURIComponent(project.hashtag)}`,
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
    if (res.type) {
      res.type('application/xml')
    }
    return res.send(data.toString())
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export default sitemap
