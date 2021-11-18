import { Request, Response } from 'express'
import { getAllPodcast, getOnePodcastById } from '../../services/firebase/podcasts'
import initF from '../../services/firebase/init'

const feed = async (req: Request, res: Response) => {
  initF()
  if (req?.query?.guid) {
    return res.json(await getOnePodcastById(req.query.guid as string))
  } else if (req?.query?.random) {
    const random = (await getAllPodcast()).sort(() => 0.5 - Math.random()).slice(0, Number(req?.query?.random))
    return res.json(random)
  } else {
    return res.json(await getAllPodcast())
  }
}
export default feed
