import { Request, Response } from 'express'

import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions'
import getRawBody from 'raw-body'
import discordInteraction from '../../services/discord/bot'
import { sendTxtLoading } from '../../services/discord/bot/utils'

const bot = async (req: Request, res: Response) => {
  if (req.method !== 'POST') return res.status(404).end()

  try {
    const rawBody = await getRawBody(req as any)
    const signature = String(req.headers['X-Signature-Ed25519']) || ''
    const timestamp = String(req.headers['X-Signature-Timestamp']) || ''
    const isValidRequest = await verifyKey(
      rawBody as any,
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
  }
}

export default bot
