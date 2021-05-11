import {InteractionResponseType} from "discord-interactions";
import {config} from "firebase-functions";
import {Response as Res} from "express";
import axios from "axios";

interface DiscorUser {
  avatar: string,
  username: string,
}

export const sendTxt = (res: Res, text:string): Res => res.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: text,
  },
});

export const getUserData = async (userId: string): Promise<DiscorUser> => {
  const url = `https://discord.com/api/v8/users/${userId}`;
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const res = await axios.get(url, {headers}).catch((err) => {
    console.error("getUserData", err);
    return err;
  });
  return Promise.resolve(res.data as DiscorUser);
};

export const sendTxtLoading = (res: Res): Res => res.send({
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Le bot réflechis..",
  },
});

export const sendTxtLater = async (text:string, applicationId:string, interactionToken: string): Promise<void> => {
  const url = `https://discord.com/api/v8/webhooks/${applicationId}/${interactionToken}/messages/@original`;
  await axios.patch(url,
      {
        content: text,
      }, {}).then((res) => {
    console.log(res, text, applicationId, interactionToken);
  }).catch((err) => {
    console.error("sendTxtLater", err);
    return err;
  });
  return Promise.resolve();
};
