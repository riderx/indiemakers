import { Request, Response } from 'express'
import { getUsersById } from '../../services/discord/bot/user'

const maker = async (req: Request, res: Response) => {
  if (req?.query?.id) {
    const user = await getUsersById(String(req.query.id))
    if (user) {
      user.makerlogHook = ''
      user.wipApiKey = ''
    }
    res.json(user)
  } else {
    res.json({ error: 'not found' })
  }
}
export default maker
