import express from "express";

import {Request, Response} from "express";
import {initializeApp, credential} from "firebase-admin";
import discordInteraction from "./bot";
/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from "dotenv";
import { verifyKey } from 'discord-interactions';
const CLIENT_PUBLIC_KEY = "76a1cf12caec747f872ee6ea064269d4acd2538b2f1e26f89853f93c32d045db";

dotenv.config();
if (process.env.GOOGLE_SERVICE_ACCOUNT) {
  initializeApp({
    credential: credential.cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)),
    databaseURL: "https://indiemakerfr.firebaseio.com",
  });
} else {
  Error('Missing api key')
}
const app = express();
const port = 4000;

app.use(express.json());
app.all("/discord_interaction", async (req: Request, res: Response) => {
  const signature = String(req.headers["X-Signature-Ed25519"]) || "";
  const timestamp = String(req.headers["X-Signature-Timestamp"]) || "";
  const isValidRequest = await verifyKey(JSON.stringify(req.body), signature, timestamp, CLIENT_PUBLIC_KEY);
  if (!isValidRequest) {
    return res.status(401).end("Bad request signature");
  }
  return discordInteraction(req.body, res)
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Success! Your application is running on port ${port}.`);
});
