import { Request, Response } from 'express'
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import initF from '../../services/firebase/init'
import discordInteraction from '../../services/discord/bot'
import { sendTxtLoading } from '../../services/discord/bot/utils'

export const config = {
  api: {
    bodyParser: false,
  },
}

const bot = async (req: Request, res: Response) => {
  console.error('bot')
  initF()
  try {
    const signature = String(req.headers ? req.headers['x-signature-ed25519'] : req.get('X-Signature-Ed25519'))
    const timestamp = String(req.headers ? req.headers['x-signature-timestamp'] : req.get('X-Signature-Timestamp'))
    const isValidRequest = await verifyKey((req as any).rawBody, signature, timestamp, String(process.env.CLIENT_PUBLIC_KEY))
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
