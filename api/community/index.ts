import { Request, Response } from 'express'
import { getAllUsers } from '../../services/firebase/discord'
import fFnit from '../../services/firebase/init'

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
