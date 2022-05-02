import type { Handler } from '@netlify/functions'
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import initF from '../../services/firebase/init'
import discordInteraction from '../../services/discord/bot'
import { sendTxtLoading } from '../../services/discord/bot/utils'

export const basicHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

export const sendRes = (data: any = { status: 'ok' }, statusCode = 200) => ({
  statusCode,
  headers: basicHeaders,
  body: JSON.stringify(data),
})

export const handler: Handler = async (event) => {
  console.error('bot')
  initF()
  try {
    const signature = event.headers['x-signature-ed25519'] || ''
    const timestamp = event.headers['x-signature-timestamp'] || ''
    const isValidRequest = await verifyKey(event.body || '{}', signature, timestamp, String(process.env.CLIENT_PUBLIC_KEY))
    if (!isValidRequest) {
      return sendRes({ status: 'Bad request signature' }, 401)
    }
    const body = JSON.parse(event.body || '{}')
    if (event.body && body.type === InteractionType.APPLICATION_COMMAND && body.data) {
      try {
        await sendTxtLoading(body)
        await discordInteraction(body)
      } catch (e) {
        console.error('bot', e)
      }
      return sendRes({ status: 'fail' }, 500)
    }
    return sendRes({
      type: InteractionResponseType.PONG,
    })
  } catch (error: any) {
    console.error(error.message)
    return sendRes({ status: 'Error bot', error: error.message }, 500)
  }
}
