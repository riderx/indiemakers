import { Request, Response } from 'express'

const robot = (_req: Request, res: Response) => {
  try {
    const data = 'User-agent: *\nAllow: /\nUser-agent: *\nDisallow: /rss.xml\nSitemap: https://indiemakers.fr/sitemap.xml'
    if (res.type) {
      res.type('text/plain')
    }
    return res.send(data.toString())
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export default robot
