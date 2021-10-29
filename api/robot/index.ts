import { Request, Response } from 'express'

const robot = (_req: Request, res: Response) => {
  try {
    const data = 'User-agent: *\nAllow: /\nSitemap: https://indiemakers.fr/sitemap.xml'
    res.type('text/plain')
    return res.send(data.toString())
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export default robot
