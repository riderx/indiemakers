import express, {Request, Response} from "express";

import {initializeApp, credential} from "firebase-admin";
import discordInteraction from "./src/discord/bot";
/* eslint-disable @typescript-eslint/no-var-requires */
const serviceAccount = require("./indiemakerfr-firebase-adminsdk-jvx27-86da276b76.json");
import * as dotenv from "dotenv";

dotenv.config();
initializeApp({
  credential: credential.cert(serviceAccount),
  databaseURL: "https://indiemakerfr.firebaseio.com",
});

const app = express();
const port = 4000;

const rawBodySaver = (req:Request, res:Response, buf:any, encoding:any) => {
  if (buf && buf.length) {
    (req as any).rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.json({verify: rawBodySaver}));
app.all("/discord_interaction", discordInteraction);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Success! Your application is running on port ${port}.`);
});
