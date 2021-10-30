import { Request, Response } from 'express'
import initF from '../../services/firebase/init'
import { getToolsDb } from './../../services/firebase/tools'

const list = async (_req: Request, res: Response) => {
  initF()
  try {
    const tools = await getToolsDb()
    return res.json(tools)
  } catch (err) {
    console.error(err);
    return []
  }
}

export default list
