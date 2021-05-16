import {InteractionResponseType} from "discord-interactions";
import {config} from "firebase-functions";
import {Response as Res} from "express";
import axios from "axios";
import {hexToDec} from "hex2dec";
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
  title?: string,
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
export const author = (name: string, url: string, icon_url: string): Author => ({name, url, icon_url});
export const field = (name:string, value:string, inline=true): Field => ({name, value, inline});
export const embed = (title:string| undefined = undefined, description="",
    color="", fields: Field[]=[],
    author:Author| undefined = undefined,
    footer: Footer| undefined = undefined,
    timestamp="",
    url="",
    thumbnail: Image| undefined = undefined,
    image: Image| undefined = undefined
): Embed => {
  const data: Embed = {fields};
  if (title && title !== "") {
    data.title = title;
  }
  if (url && url !== "") {
    data.url = url;
  }
  if (description && description !== "") {
    data.description = description;
  }
  if (color && color !== "") {
    data.color = hexToDec(`0x${color}`);
  }
  if (timestamp && timestamp !== "") {
    data.timestamp = timestamp;
  }
  if (footer) {
    data.footer = footer;
  }
  if (author) {
    data.author = author;
  }
  if (thumbnail) {
    data.thumbnail = thumbnail;
  }
  if (image) {
    data.image = image;
  }
  return data;
};

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
      embeds,
    };
    await axios.patch(url, body).catch(async (err) => {
      console.error("sendTxtLater", err);
      await axios.patch(url, {content: "🤖 Oups, previens mon créateur j'ai un bug!"}).catch(async (errErr) => {
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

export const openChannel = async (userId: string): Promise<any> => {
  const url = "https://discord.com/api/v8/users/@me/channels";
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const res = await axios.post(url, {recipient_id: userId}, {headers})
      .catch((err) => {
        console.error("openChannel", err);
        return err;
      });
  return Promise.resolve(res.data as any);
};
// https://discord.com/api/webhooks/841492487125598218/b0Rvbv41Uy2w6UxUutctXYeKYd0QAXOKnjhgCOTOyfjSs9hgpYOPxjizWiu4vi-s17nX

export const senChannel = async (channelId: string, content: string, embed: Embed| undefined = undefined): Promise<any> => {
  const url = `https://discord.com/api/v8/channels/${channelId}/messages`;
  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
  };
  const body: any = {content};
  if (embed) {
    body.embed = embed;
  }
  const res = await axios.post(url, body, {headers})
      .catch((err) => {
        console.error("senChannel", err);
        return err;
      });
  return Promise.resolve(res.data as any);
};

// export const sendToWebhook = async (webhook: string, content: string, embeds: Embed[]= []): Promise<any> => {
//   const headers = {
//     "Authorization": `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : config().discord.bot_token}`,
//   };
//   const res = await axios.post(webhook, {content, embeds}, {headers})
//       .catch((err) => {
//         console.error("sendToWebhook", err);
//         return err;
//       });
//   return Promise.resolve(res.data as any);
// };