import { Request, Response } from 'express'
import fFnit from '../../services/firebase_init'

import { getAllUsers } from '../../services/discord/bot/user'

const list = async (_req: Request, res: Response) => {
  fFnit()
  const data = await getAllUsers()
  data.users.forEach((user) => {
    user.makerlogHook = ''
    user.wipApiKey = ''
  })
  return res.json(data)
}

export default list
