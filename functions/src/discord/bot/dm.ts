import {config} from "firebase-functions";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export const openDmChannel = async (userId: string): Promise<any> => {
  const url = "https://discord.com/api/v8/users/@me/channels";
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const res = await axios.post(url, {recipient_id: userId}, {headers})
      .catch((err) => {
        console.error("openDmChannel", err);
        return err;
      });
  return Promise.resolve(res.data as any);
};
// https://discord.com/api/webhooks/841492487125598218/b0Rvbv41Uy2w6UxUutctXYeKYd0QAXOKnjhgCOTOyfjSs9hgpYOPxjizWiu4vi-s17nX

export const sendDmChannel = async (channelId: string, content: string): Promise<any> => {
  const url = `https://discord.com/api/v8/channels/${channelId}/messages`;
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const res = await axios.post(url, {content}, {headers})
      .catch((err) => {
        console.error("sendDmChannel", err);
        return err;
      });
  return Promise.resolve(res.data as any);
};

export const sendToWebhook = async (webhook: string, content: string): Promise<any> => {
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const res = await axios.post(webhook, {content}, {headers})
      .catch((err) => {
        console.error("sendToWebhook", err);
        return err;
      });
  return Promise.resolve(res.data as any);
};
