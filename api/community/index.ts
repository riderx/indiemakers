import { Request, Response } from 'express'

import { getAllUsers } from '../../services/discord/bot/user'

const list = async (req: Request, res: Response) => {
  const data = await getAllUsers()
  data.users.forEach((user) => {
    user.makerlogHook = ''
    user.wipApiKey = ''
  })
  return res.json(data)
}

export default list
