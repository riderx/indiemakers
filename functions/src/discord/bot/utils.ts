import {InteractionResponseType} from "discord-interactions";
import {config} from "firebase-functions";
import {Response} from "express";
import axios from "axios";

export const sendTxt = (res:Response, text:string) => res.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: text,
  },
});

export const getUserData: any = (userId:string) => {
  const url = `https://discord.com/api//v8/users/${userId}`;
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  return axios.get(url, {headers}).catch((err) => {
    console.error(err);
    return {};
  });
};

export const sendTxtLoading = (res:Response) => res.send({
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Le bot réflechis..",
  },
});

export const sendTxtLater = async (text:string, application_id:string, interaction_token: string) => {
  const url = `https://discord.com/api/v8/webhooks/${application_id}/${interaction_token}/messages/@original`;
  return axios.patch(url,
      {
        content: text,
      }, {}).catch((err) => {
    console.error(err);
  });
};
