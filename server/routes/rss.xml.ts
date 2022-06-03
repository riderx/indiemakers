import RSS from 'rss'
import Parser from 'rss-parser'
import { getAllPodcast } from '~~/services/firebase/podcasts'

const rss = 'https://anchor.fm/s/414d1d4/podcast/rss'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const parser = new Parser()
    const feedBase = await parser.parseURL(rss)
    const eps = await getAllPodcast()

    // const eps = await sourceFeed()
    const feed = new RSS({
      title: feedBase.title || '',
      description: 'description',
      feed_url: `${config.baseUrl}/rss.xml`,
      site_url: config.baseUrl,
      image_url: feedBase.image_url,
      managingEditor: 'Martin Donadieu et Anthonin Archer',
      webMaster: 'Martin Donadieu',
      copyright: 'INDIE MAKERS',
      language: 'fr',
      categories: ['podcast', 'entrepreneur', 'makers', 'independants'],
      pubDate: feedBase.pubDate,
      ttl: feedBase.ttl,
    })

    eps.forEach((element) => {
      feed.item({
        title: element.title,
        description: element.content,
        url: `${config.baseUrl}/episode/${element.id}`,
        guid: element.id,
        author: `Martin Donadieu and ${element.title}`,
        date: element.pubDate,
        enclosure: {
          url: element.imageBig,
          type: 'image/jpeg',
        },
      })
    })
    const xml = feed.xml()
    event.res.setHeader('Content-Type', "application/xml")
    return xml
  } catch (e) {
    console.error(e)
    event.res.statusCode = 500
    return {}
  }
})
