import { getAllPodcast, getOnePodcastById } from '../../services/firebase/podcasts';
import { Request, Response } from 'express'
import fFnit from '../../services/firebase/init'

const feed = async (req: Request, res: Response) => {
  fFnit()
  if (req?.query?.guid) {
    return res.json(await getOnePodcastById(req.query.guid as string))
  } else {
    return res.json(await getAllPodcast())
  }
}
export default feed
