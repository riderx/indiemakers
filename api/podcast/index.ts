import { Request, Response } from 'express'
import { getOnePodcastById } from '../../services/firebase/podcasts'
import fFnit from '../../services/firebase/init'

const ep = async (req: Request, res: Response) => {
  fFnit()
  return res.json(await getOnePodcastById(req.query.guid as string))
}
export default ep
