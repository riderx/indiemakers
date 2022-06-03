
export default defineEventHandler(async (event) => {
  try {
    const data = 'User-agent: *\nAllow: /\nUser-agent: *\nDisallow: /rss.xml\nSitemap: https://indiemakers.fr/sitemap.xml'
    event.res.setHeader('Content-Type', 'text/plain')
    return data.toString()
  } catch (e) {
    console.error(e)
    event.res.statusCode = 500
    return {}
  }
})

