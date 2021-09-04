import { getAllPodcast } from '../../services/firebase/podcasts';
import { Request, Response } from 'express'
import fFnit from '../../services/firebase/init'

const feed = async (_req: Request, res: Response) => {
  fFnit()
  return res.json(await getAllPodcast())
}
export default feed
