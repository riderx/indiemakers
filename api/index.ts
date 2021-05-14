import { Request, Response } from 'express'

export default function (_req: Request, res: Response) {
  return res.json({ ok: 'done' })
}
