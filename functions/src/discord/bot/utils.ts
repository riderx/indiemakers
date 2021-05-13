import {InteractionResponseType} from "discord-interactions";
import {config} from "firebase-functions";
import {Response as Res} from "express";
import axios from "axios";

interface DiscorUser {
  avatar: string,
  username: string,
}
interface Field {
  name: string,
  value: string,
  inline: boolean
}
interface Author {
  name: string,
  url?: string,
  icon_url?: string
}
interface Footer {
  text: string,
  icon_url: string
}

interface Image {
  url: string,
}
export interface Embed {
  title: string,
  description?: string,
  url?: string,
  color?: string,
  fields?: Field[]
  author?: Author,
  footer?: Footer,
  timestamp?: string,
  thumbnail?: Image,
  image?: Image,
}
interface DiscordMessage
{
  content: string,
  embeds?: Embed[]
}

export const image = (url:string): Image => ({url});
export const footer = (text: string, icon_url: string): Footer => ({text, icon_url});
export const author = (name: string, url: string, icon_url: string): Author => ({name,  url,  icon_url});
export const field = (name:string, value:string, inline=true): Field => ({name, value, inline});
export const embed = (title:string, description:string="",
color:string="", fields: Field[]=[],
author:Author| undefined = undefined,
footer: Footer| undefined = undefined,
timestamp: string="",
thumbnail: Image| undefined = undefined,
image: Image| undefined = undefined
): Embed => {
  const data: Embed = {title, author, footer, thumbnail, image, fields};
  if (description && description !== "") {
    data.description = description;
  }
  if (color && color !== "") {
    data.color = color;
  }
  if (timestamp && timestamp !== "") {
    data.timestamp = timestamp;
  }
  return data;
};
// [{
//   "title": "🎙 INDIE MAKERS",
//   "description": "Description de mon super project\n**yoyoyy**",
//   "color": 4925339,
//   "fields": [
//     {
//       "name": "Flammes",
//       "value": "10",
//       "inline": true
//     },
//     {
//       "name": "Taches",
//       "value": "34",
//       "inline": true
//     },
//     {
//       "name": "Site",
//       "value": "https://indiemakers.fr"
//     }
//   ],
//   "author": {
//     "name": "Martin Donadieu",
//     "url": "https://martin.com",
//     "icon_url": "https://makerlog-storage.s3.amazonaws.com/media/uploads/avatars/2021/04/22/profil_martin.png?tr="
//   },
//   "footer": {
//     "text": "Derniere tache"
//   },
//   "timestamp": "2021-05-03T23:00:00.000Z",
//   "thumbnail": {
//     "url": "https://indiemakers.fr/_nuxt/img/cover-im@0.5x.da57ed6.png"
//   }
// },]


export const sendTxt = (res: Res, text:string): Res => res.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: text,
  },
});

export const getUserData = async (userId: string): Promise<DiscorUser| undefined> => {
  const url = `https://discord.com/api/v8/users/${userId}`;
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  try {
    const res = await axios.get(url, {headers});
    return Promise.resolve(res.data as DiscorUser);
  } catch (err) {
    console.error("getUserData", err);
    return Promise.resolve(undefined);
  }
};

export const sendTxtLoading = (res: Res): Res => res.send({
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Le bot réflechis..",
  },
});

export const sendTxtLater = async (content:string, embeds: Embed[]= [], applicationId:string, interactionToken: string): Promise<void> => {
  const url = `https://discord.com/api/v8/webhooks/${applicationId}/${interactionToken}/messages/@original`;
  try {
    const body: DiscordMessage = {
      content,
      embeds
    }
    await axios.patch(url, body, {}).catch(async (err) => {
      console.error("sendTxtLater", err);
      await axios.patch(url, {content: "🤖 Oups, previens mon créateur j\ai un bug!"}, {}).catch(async (errErr) => {
        console.error("sendTxtLaterFallback", err, errErr);
      });
      return err;
    });
    return Promise.resolve();
  } catch (err) {
    console.error("sendTxtLater", err);
    return Promise.resolve();
  }
};

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

export const sendDmChannel = async (channelId: string, content: string, embed: Embed[]= []): Promise<any> => {
  const url = `https://discord.com/api/v8/channels/${channelId}/messages`;
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const res = await axios.post(url, {content, embed}, {headers})
      .catch((err) => {
        console.error("sendDmChannel", err);
        return err;
      });
  return Promise.resolve(res.data as any);
};

export const sendToWebhook = async (webhook: string, content: string, embed: Embed[]= []): Promise<any> => {
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const res = await axios.post(webhook, {content, embed}, {headers})
      .catch((err) => {
        console.error("sendToWebhook", err);
        return err;
      });
  return Promise.resolve(res.data as any);
};
