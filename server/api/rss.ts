import RSS from 'rss'
import Parser from 'rss-parser'
import { getAllPodcast } from '~~/services/firebase/podcasts'

const rss = 'https://anchor.fm/s/414d1d4/podcast/rss'

export default defineEventHandler(async (event) => {
  try {
    const parser = new Parser()
    const feedBase = await parser.parseURL(rss)
    const eps = await getAllPodcast()

    // const eps = await sourceFeed()
    const feed = new RSS({
      title: feedBase.title || '',
      description: 'description',
      feed_url: 'https://indiemakers.fr/rss.xml',
      site_url: 'https://indiemakers.fr',
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
        url: `https://indiemakers.fr/episode/${element.id}`,
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
    event.res.setHeader('Content-Type', 'application/xml')
    return xml
  } catch (e) {
    console.error(e)
    event.res.statusCode = 500
    return {}
  }
})
