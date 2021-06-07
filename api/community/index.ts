import { Request, Response } from 'express'
import fFnit from '../../services/firebase_init'

import { getAllUsers } from '../../services/discord/bot/user'

const list = async (_req: Request, res: Response) => {
  fFnit()
  const users = await getAllUsers()
  users.forEach((user) => {
    user.makerlogHook = ''
    user.wipApiKey = ''
  })
  return res.json(users)
}

export default list
