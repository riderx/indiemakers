import { Request, Response } from 'express'

import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions'
import discordInteraction from '../../services/discord/bot'
import { sendTxtLoading } from '../../services/discord/bot/utils'

const bot = async (req: Request, res: Response) => {
  try {
    const rawBody = JSON.stringify(req.body)
    const signature = String(
      req.headers
        ? req.headers['x-signature-ed25519']
        : req.get('X-Signature-Ed25519')
    )
    const timestamp = String(
      req.headers
        ? req.headers['x-signature-timestamp']
        : req.get('X-Signature-Timestamp')
    )
    console.error(
      'vals',
      rawBody,
      req.headers,
      signature,
      timestamp,
      process.env.CLIENT_PUBLIC_KEY
    )
    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      String(process.env.CLIENT_PUBLIC_KEY)
    )
    if (!isValidRequest) {
      return res.status(401).end('Bad request signature')
    }
    if (
      req.body &&
      req.body.type === InteractionType.APPLICATION_COMMAND &&
      req.body.data
    ) {
      await sendTxtLoading(res)
      await discordInteraction(req.body)
      return
    }
    return res.send({
      type: InteractionResponseType.PONG,
    })
  } catch (error) {
    console.error(error.message)
    return res.status(500).end('Error bot', error.message)
  }
}
export const config = { api: { bodyParser: false } }
export default bot
