import { Request, Response } from 'express'

import { getAllUsers } from '../../functions/src/discord/bot/user'

const list = async (req: Request, res: Response) => {
  return res.json(await getAllUsers())
}

export default list
