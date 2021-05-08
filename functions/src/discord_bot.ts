import {InteractionResponseType, InteractionType, verifyKey} from "discord-interactions";
import {firestore} from "firebase-admin";
import {Request, Response} from "express";
import axios from "axios";

const CLIENT_PUBLIC_KEY = "76a1cf12caec747f872ee6ea064269d4acd2538b2f1e26f89853f93c32d045db";

const getAllKarma = async () => {
  const documents = await firestore().collection("karma").get();

  const users: any[] = documents.docs
      .map((doc) => doc.data());
  return users;
};

const getKarmaById = async (id: string) => {
  const documents = await firestore().collection(`karma/${id}/votes`).get();

  try {
    const votes: any[] = documents.docs
        .map((doc) => doc.data());
    const total = votes.reduce((tt, current) => tt + current.value, 0);
    return {votes, total};
  } catch {
    return {votes: [], total: 0};
  }
};

const addKarmaVotesById = (userId: string, senderId: string, value: number) => firestore().collection(`karma/${userId}/votes`).add({userId: senderId, value});

const updateKarmaById = async (userId: string, total: number) => {
  const userDoc = await firestore().collection("karma").doc(userId).get();
  if (!userDoc.exists || !userDoc.data) {
    return firestore().collection("karma").doc(userId).set({userId, total});
  }
  return userDoc.ref.update({userId, total});
};

const sendTxt = (res:Response, text:string) => res.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: text,
  },
});

const sendTxtLater = async (res:Response, text:string, application_id:string, interaction_token: string) => {
  const url = `https://discord.com/api/v8/webhooks/${application_id}/${interaction_token}/messages/@original`;
  console.log("url", url);

  return axios.patch(url,
      {
        content: text,
      }, {}).catch((err) => {
    console.error(err);
  });
};

const sendTxtLoading = (res:Response) => res.send({
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Le bot réflechis..",
  },
});

const karma_add = async (res:Response, interaction: any, option:any, senderId:string) => {
  const userId = option.value;
  console.log("add karma userId", userId);
  if (senderId === userId) {
    return sendTxtLater(res, "Tu ne peux pas t'ajouter du karma toi même !", interaction.application_id, interaction.token);
  }
  const curKarma = await getKarmaById(userId);
  await updateKarmaById(userId, curKarma.total + 1);
  await addKarmaVotesById(userId, senderId, 1);
  return sendTxtLater(res, `Tu as donné du karma a <@${userId}>\nIl a maintenant: ${curKarma.total - 1} karma!`, interaction.application_id, interaction.token);
};

const karma_rm = async (res:Response, interaction: any, option:any, senderId:string) => {
  const userId = option.value;
  console.log("remove karma userId", userId);
  if (senderId === userId) {
    return sendTxtLater(res, "Tu ne peux pas te prendre du karma toi même !", interaction.application_id, interaction.token);
  }
  const curKarma = await getKarmaById(userId);
  if (curKarma.total > 0) {
    await updateKarmaById(userId, curKarma.total - 1);
    await addKarmaVotesById(userId, senderId, 1);
    return sendTxtLater(res, `Tu as enlevé du karma a <@${userId}>\nIl lui reste: ${curKarma.total - 1} karma`, interaction.application_id, interaction.token);
  }
  return sendTxtLater(res, `<@${userId}> n'as plus de karma...\n Laisse le tranquile!`, interaction.application_id, interaction.token);
};

const generateKarmaStats = async () => {
  let result = "";
  let allKarma = await getAllKarma();
  allKarma = allKarma.sort((firstEl, secondEl) => secondEl.total - firstEl.total);
  allKarma.forEach((element) => {
    result += `<@${element.userId}> = ${element.total}\n`;
  });
  return result;
};

const karma_stats = async (res:Response, interaction: any, option:any) => {
  const userId = option.value;
  console.log("stats karma userId", userId);
  const curKarma = await getKarmaById(userId);
  return sendTxtLater(res, `<@${userId}> a ${curKarma.total} karma !`, interaction.application_id, interaction.token);
};

const karma_ladder = async (res:Response, interaction: any,) => {
  console.log("stats karma global");
  return sendTxtLater(res, `Voici le classement karma de tous les makers:\n\n${await generateKarmaStats()}`, interaction.application_id, interaction.token);
};

const karma_fn = async (res:Response, interaction:any, option:any, senderId:string) => {
  if (option.name === "donner" && option.options.length > 0) {
    await karma_add(res, interaction, option.options[0], senderId);
    return Promise.resolve() as any;
  } if (option.name === "enlever" && option.options.length > 0) {
    await karma_rm(res, interaction, option.options[0], senderId);
    return Promise.resolve() as any;
  } if (option.name === "stats" && option.options.length > 0) {
    const options = option.options ? option.options[0] : null;
    await karma_stats(res, interaction, options);
    return Promise.resolve() as any;
  } if (option.name === "classement") {
    await karma_ladder(res, interaction);
    return Promise.resolve() as any;
  }
  return sendTxtLater(res, `La Commande ${option.name} n'est pas pris en charge`, interaction.application_id, interaction.token);
};

const im = async (res:Response, interaction: any, option:any, senderId:string) => {
  if (option.name === "karma" && option.options.length > 0) {
    await sendTxtLoading(res);
    return karma_fn(res, interaction, option.options[0], senderId);
  }
  return sendTxt(res, `La Commande ${option.name} n'est pas pris en charge`);
};

const discordInteraction = async (req:Request, res:Response) => {
  // Verify the request
  const signature = req.get("X-Signature-Ed25519") || "";
  const timestamp = req.get("X-Signature-Timestamp") || "";
  const isValidRequest = await verifyKey((req as any).rawBody, signature, timestamp, CLIENT_PUBLIC_KEY);
  if (!isValidRequest) {
    return res.status(401).end("Bad request signature");
  }

  const interaction = req.body;
  if (interaction && interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === "im" && interaction.data.options.length > 0) {
      return im(res, interaction, interaction.data.options[0], interaction.member.user.id);
    }
    return sendTxt(res, `La Commande ${interaction.data.name} n'est pas pris en charge`);
  }
  return res.send({
    type: InteractionResponseType.PONG,
  });
};

export default discordInteraction;
