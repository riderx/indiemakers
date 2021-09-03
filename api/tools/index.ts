import { Request, Response } from 'express'
import fFnit from '../../services/firebase/init'
import { getToolsDb } from './../../services/firebase/tools'

const list = async (_req: Request, res: Response) => {
  fFnit()
  try {
    const tools = await getToolsDb()
    return res.json(tools)
  } catch (err) {
    console.error(err);
    return []
  }
}

export default list
