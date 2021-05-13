import { Request, Response } from 'express'
import { feed as sourceFeed } from '../../services/feed'

const feed = async (req: Request, res: Response) => {
  return res.json(await sourceFeed())
}
export default feed
