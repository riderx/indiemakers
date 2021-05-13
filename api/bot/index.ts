import { Request, Response } from 'express'

import { verifyKey } from 'discord-interactions'
import discordInteraction from '../../services/discord/bot'
const CLIENT_PUBLIC_KEY =
  '76a1cf12caec747f872ee6ea064269d4acd2538b2f1e26f89853f93c32d045db';

  function getRawBody(req: Request): Promise<string> {
    return new Promise((resolve, reject) => {
      const bodyChunks: Buffer[] = [];
      req.on("end", () => {
        const rawBody = Buffer.concat(bodyChunks).toString("utf8");
        resolve(rawBody);
      });
      req.on("data", (chunk) => bodyChunks.push(chunk));
      return;
    });
  }

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
      CLIENT_PUBLIC_KEY
    )
    if (!isValidRequest) {
      return res.status(401).end('Bad request signature')
    }

    return discordInteraction(req.body, res as any as Response)
  } catch (error) {
    console.error(error.message)
  }
}

export default bot
