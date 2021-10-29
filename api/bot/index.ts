import { Request, Response } from 'express'
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import getRawBody from 'raw-body'
import { parse } from 'content-type'
import fFnit from '../../services/firebase/init'
import discordInteraction from '../../services/discord/bot'
import { sendTxtLoading } from '../../services/discord/bot/utils'

const getRaw = (req: Request): Promise<string> =>
  new Promise((resolve, reject) => {
    getRawBody(
      req,
      {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: parse(req).parameters.charset,
      },
      (err, string) => {
        if (err) return reject(err)
        resolve(string)
      }
    )
  })

export const config = {
  api: {
    bodyParser: false,
  },
}

const bot = async (req: Request, res: Response) => {
  console.error('bot')
  fFnit()
  try {
    const rawBody: string = await getRaw(req)
    const signature = String(req.headers ? req.headers['x-signature-ed25519'] : req.get('X-Signature-Ed25519'))
    const timestamp = String(req.headers ? req.headers['x-signature-timestamp'] : req.get('X-Signature-Timestamp'))
    const isValidRequest = await verifyKey(rawBody, signature, timestamp, String(process.env.CLIENT_PUBLIC_KEY))
    if (!isValidRequest) {
      return res.status(401).end('Bad request signature')
    }
    if (req.body && req.body.type === InteractionType.APPLICATION_COMMAND && req.body.data) {
      try {
        await sendTxtLoading(res)
        await discordInteraction(req.body)
      } catch (e) {
        console.error('bot', e)
      }
      return
    }
    return res.send({
      type: InteractionResponseType.PONG,
    })
  } catch (error: any) {
    console.error(error.message)
    return res.status(500).end('Error bot', error.message)
  }
}
export default bot
