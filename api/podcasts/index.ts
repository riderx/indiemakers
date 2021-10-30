import { Request, Response } from 'express'
import { getAllPodcast, getOnePodcastById } from '../../services/firebase/podcasts'
import initF from '../../services/firebase/init'

const feed = async (req: Request, res: Response) => {
  initF()
  if (req?.query?.guid) {
    return res.json(await getOnePodcastById(req.query.guid as string))
  } else {
    return res.json(await getAllPodcast())
  }
}
export default feed
