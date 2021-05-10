import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {getUserData, sendTxtLater} from "./utils";
import {Response} from "express";

const getAllKarma = async () => {
  const documents = await firestore().collection("karma").get();

  const users: any[] = documents.docs
      .map((doc) => doc.data());
  return users;
};


const getKarmaById = async (id: string) => {
  try {
    const documents = await firestore().collection(`discord/${id}/karma`).get();
    const votes: any[] = documents.docs
        .map((doc) => ({docId: doc.id, ...doc.data()}));
    const total = votes.reduce((tt, current) => tt + current.value, 0);
    return {votes, total};
  } catch (err) {
    console.error("err", err);
    return {votes: [], total: 0};
  }
};

const addKarmaVotesById = (userId: string, senderId: string, value: number) => firestore().collection(`discord/${userId}/karma`).add({userId: senderId, value, createdAt: dayjs().toISOString()});

const updateKarmaById = async (userId: string, total: number) => {
  const userDoc = await firestore().collection("karma").doc(userId).get();
  if (!userDoc.exists || !userDoc.data) {
    const userInfo = await getUserData(userId);
    const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.data.avatar}.png`;
    const newUser = {userId, avatar: userInfo.data.avatar, avatarUrl, username: userInfo.data.username, total, createdAt: dayjs().toISOString()};
    return firestore().collection("karma").doc(userId).set(newUser);
  }
  return userDoc.ref.update({userId, total, updateAt: dayjs().toISOString()});
};
const karma_add = async (res:Response, interaction: any, option:any, senderId:string) => {
  const userId = option.value;
  console.log("add karma userId", userId);
  if (senderId === userId) {
    return sendTxtLater("Tu ne peux pas t'ajouter du karma toi même !", interaction.application_id, interaction.token);
  }
  const curKarma = await getKarmaById(userId);
  await updateKarmaById(userId, curKarma.total + 1);
  await addKarmaVotesById(userId, senderId, 1);
  const botString = `Tu as donné du karma a <@${userId}>\nIl a maintenant: ${curKarma.total + 1} karma!`;
  return sendTxtLater(botString, interaction.application_id, interaction.token);
};

const karma_rm = async (res:Response, interaction: any, option:any, senderId:string) => {
  const userId = option.value;
  console.log("remove karma userId", userId);
  if (senderId === userId) {
    return sendTxtLater("Tu ne peux pas te prendre du karma toi même !", interaction.application_id, interaction.token);
  }
  const curKarma = await getKarmaById(userId);
  if (curKarma.total > 0) {
    await updateKarmaById(userId, curKarma.total - 1);
    await addKarmaVotesById(userId, senderId, 1);
    const botString = `Tu as enlevé du karma a <@${userId}>\nIl lui reste: ${curKarma.total - 1} karma`;
    return sendTxtLater(botString, interaction.application_id, interaction.token);
  }
  return sendTxtLater(`<@${userId}> n'as plus de karma...\n Laisse le tranquile!`, interaction.application_id, interaction.token);
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
  return sendTxtLater(`<@${userId}> a ${curKarma.total} karma !`, interaction.application_id, interaction.token);
};

const karma_ladder = async (res:Response, interaction: any,) => {
  console.log("stats karma global");
  return sendTxtLater(`Voici le classement karma de tous les makers:\n\n${await generateKarmaStats()}`, interaction.application_id, interaction.token);
};

export const karma_fn = async (res:Response, interaction:any, option:any, senderId:string) => {
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
  return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge`, interaction.application_id, interaction.token);
};
