import { SitemapStream, streamToPromise } from 'sitemap'
import initF from '~~/services/firebase/init'
import { getAllUsers } from '~~/services/firebase/discord'
import { getAllPodcast } from '~~/services/firebase/podcasts'
import { serverQueryContent } from '#content/server'
import { getAllAllProject } from '../../services/firebase/project'


export default defineEventHandler(async (event) => {
  try {
    initF()
    const config = useRuntimeConfig()
    const smStream = new SitemapStream({ hostname: config.baseUrl })

    smStream.write({ url: '/tools', changefreq: 'monthly', priority: 0.1 })
    smStream.write({ url: '/makers', changefreq: 'daily', priority: 0.5 })
    smStream.write({ url: '/articles', changefreq: 'daily', priority: 1 })
    const eps = await getAllPodcast()
    let prio = 1.0

    eps.forEach((element) => {
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
      if (user.incomes || user.posts || user.tasks > 10 || user.karma > 15) {
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
    const articles = await serverQueryContent(event).where({ published: true }).find()

    articles.forEach((article: any) => {
      smStream.write({
        url: `/articles/${article.slug}`,
        changefreq: 'daily',
        priority: 0.5,
      })
    })
    smStream.end()
    const data = await streamToPromise(smStream)
    event.res.setHeader('Content-Type', "application/xml")
    return data.toString()
  } catch (e) {
    console.error(e)
    event.res.statusCode = 500
    return {}
  }
})
