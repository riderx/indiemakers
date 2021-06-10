import { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (req: Request, res: Response, next: NextFunction) {
  // if (Fals)
  // res.writeHead(302, {
  //   Location: '/api',
  // })
  // res.end()
  next()
}
