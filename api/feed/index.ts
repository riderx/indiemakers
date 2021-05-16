import { Request, Response } from 'express'
import { feed as sourceFeed } from '../../services/feed'

const feed = async (_req: Request, res: Response) => {
  console.error('feed')
  return res.json(await sourceFeed())
}
export default feed
