import { getAllPodcast, getOnePodcastById } from '~~/services/firebase/podcasts'
import initF from '~~/services/firebase/init'

export default defineEventHandler(async (event) => {
  initF()
  const query = useQuery(event)

  if (query?.guid) {
    return await getOnePodcastById(query.guid as string)
  } else if (query?.random) {
    const all = await getAllPodcast()
    const current = query?.guid || ''
    const random = all
      .filter((e) => e.guid !== current)
      .sort(() => 0.5 - Math.random())
      .slice(0, Number(query?.random))
    return random
  } else {
    return await getAllPodcast()
  }
})
