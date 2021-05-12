import {ApplicationCommandInteractionDataOption, Interaction} from "../config";
import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {Embed, embed, field, getUserData, image, openChannel, senChannel, sendTxtLater} from "./utils";
import {Project} from "./project";
const split = require("lodash.split");

export interface User {
  userId: string,
  avatar: string,
  username: string,
  avatarUrl: string,
  streak: number,
  karma: number,
  emoji: string,
  color: string,
  projects: number,
  incomes: number,
  tasks: number,
  name?: string,
  bio?: string,
  website?: string,
  lastTaskAt?: string,
  makerlogHook?: string,
  projectsData?: Project[],
  wipApiKey?: string,
  createdAt: string,
  updatedAt: string
}
// const userPublicKey = ["username", "karma", "avatarUrl", "taches", "projets", "name", "bio", "emoji", "color", "flammes", "createdAt"];
const userProtectedKey = ["userId", "username", "karma", "avatar", "tasks", "projects", "streak", "createdAt", "updatedAt", "lastTaskAt"];

export const getAllUsers = async (): Promise<{users: User[], total: number}> => {
  try {
    const documents = await firestore().collection("discord").get();
    const users: User[] = [];
    documents.docs
        .forEach((doc) => {
          const data = (doc.data() as User);
          if (data !== undefined) {
            users.push(data);
          }
        });
    return {users, total: users.length};
  } catch (err) {
    console.error("getAllUsers", err);
    return {users: [], total: 0};
  }
};

const transformKey = (key: string): string => {
  switch (key) {
    case "couleur":
      return "color";
    case "nom":
      return "name";
    case "makerlog_hook":
      return "makerlogHook";
    case "wip_key":
      return "wipApiKey";
    case "photo":
      return "avatarUrl";
    default:
      return key;
  }
};

const validValue = (key: string, value: any): boolean => {
  switch (key) {
    case "color":
      return /^[a-zA-Z]+$/.test(value);
    case "makerlogHook":
      return String(value).startsWith("https://api.getmakerlog.com/apps/webhook/");
    case "avatarUrl":
      return String(value).startsWith("https://");
    case "emoji":
      return split(value, "").length === 1 && /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(value);
    default:
      return true;
  }
};

export const getUsersById = async (userId: string): Promise<User | null> => {
  try {
    const res = await firestore().collection("discord").doc(userId).get();
    const data = res.data();
    return data !== undefined ? (data as User): null;
  } catch (err) {
    console.error("getUsersById", err);
    return null;
  }
};

export const updateUser = async (userId: string, user: Partial<User>): Promise<firestore.WriteResult> => {
  const userDoc = await firestore().collection("discord").doc(userId).get();
  if (!userDoc.exists || !userDoc.data) {
    const userInfo = await getUserData(userId);
    const base: User = {
      userId,
      avatar: "",
      avatarUrl: "",
      emoji: "",
      color: "",
      streak: 0,
      incomes: 0,
      karma: 0,
      projects: 0,
      tasks: 0,
      username: "",
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };
    if (userInfo) {
      base.avatar = userInfo.avatar;
      base.avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.png`;
      base.username = userInfo.username;
    }
    const newUser: User = Object.assign(base, user as User);
    return firestore().collection("discord").doc(userId).set(newUser);
  }
  return userDoc.ref.update({...user, updatedAt: dayjs().toISOString()});
};

const userEdit = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], userId:string): Promise<void> => {
  const update: Partial<User> = {
    updatedAt: dayjs().toISOString(),
  };
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const realKey = transformKey(element.name);
    if (!userProtectedKey.includes(realKey) && validValue(realKey, element.value)) {
      (update as any)[realKey] = element.value;
    }
  });
  console.log("userEdit", update);
  return Promise.all([
    updateUser(userId, update),
    sendTxtLater("Tu as mis a jours ton profil !\n Cela aideras les autres makers a te connaitre !", [], interaction.application_id, interaction.token),
  ]).then(() => Promise.resolve());
};

export const usersViewStreak = async (): Promise<Embed[]> => {
  const embeds: Embed[] = [];
  const res = await getAllUsers();
  const limitStreak = dayjs();
  limitStreak.subtract(1, "day");
  limitStreak.second(1);
  limitStreak.minute(0);
  limitStreak.hour(0);
  res.users = res.users.sort((firstEl: User, secondEl: User) => secondEl.streak - firstEl.streak);
  res.users = res.users.filter((user: User) => {
    const lastTaskAt = dayjs(user.lastTaskAt);
    return user.lastTaskAt && dayjs(limitStreak).isBefore(lastTaskAt);
  });
  res.users.forEach((user: User) => {
    const fields = [
      field("🔥 Flammes", String(user.streak)),
      field("🕉 Karma", String(user.karma)),
      field("🌱 Projets", String(user.projects)),
      field("💗 Taches", String(user.tasks)),
    ];
    const name = `${user.emoji || "👨‍🌾"} ${user.name || user.username}`;
    const thumb = image(user.avatarUrl);
    const userCard = embed(name, "", user.color, fields, undefined, undefined, undefined, user.createdAt, thumb);
    embeds.push(userCard);
  });
  return embeds;
};

const userList = async (interaction: Interaction): Promise<void> => {
  let usersInfo = "";
  const res = await getAllUsers();
  res.users.forEach((element: User) => {
    usersInfo += `${element.username} a shipper ${element.streak} jours d'affilés pour ${element.tasks} taches faites depuis le debut sur ${element.projects} projets !`;
  });
  console.log("userList", usersInfo);
  return sendTxtLater(`Voici la liste des makers !\n\n${usersInfo}`, [], interaction.application_id, interaction.token);
};

const userListStreak = async (interaction: Interaction): Promise<void> => {
  const usersInfoCards = await usersViewStreak();
  console.log("userList", usersInfoCards);
  const res = await firestore().collection("discord").doc("config").get();
  const data = res.data();
  let limit = 10;
  if (data) {
    limit = data.ladderLimit;
  }
  await sendTxtLater(`Voici la liste des ${limit} premiers makers avec les flammes !\n`, [], interaction.application_id, interaction.token);
  for (let index = 0; index < usersInfoCards.length && index < limit; index++) {
    const card = usersInfoCards[index];
    await senChannel(interaction.channel_id, "", card);
  }
  return Promise.resolve();
};

const userView = async (interaction: Interaction, myId:string, userId:string|undefined): Promise<void> => {
  const user = await getUsersById(userId || myId);
  if (user && userId && myId !== userId) {
    console.log("userEdit", userId);
    const fields = [
      field("🔥 Flammes", String(user.streak)),
      field("🕉 Karma", String(user.karma)),
      field("🌱 Projets", String(user.projects)),
      field("💗 Taches", String(user.tasks)),
    ];
    const name = `${user.emoji || "👨‍🌾"} ${user.name || user.username}`;
    const bio = user.bio || "Un jours je serais grand !";
    console.log("userView", userId);
    const thumb = image(user.avatarUrl);
    const userCard = embed(name, bio, user.color, fields, undefined, undefined, undefined, user.createdAt, thumb);
    return sendTxtLater("Voici les infos sur ce maker !\n", [userCard], interaction.application_id, interaction.token);
  } else if (user) {
    console.log("userView", myId);
    const fields = [
      field("🔥 Flammes", String(user.streak)),
      field("🕉 Karma", String(user.karma)),
      field("🌱 Projets", String(user.projects)),
      field("💗 Taches", String(user.tasks)),
    ];
    const fieldsAll = [];
    if (user.makerlogHook) {
      fieldsAll.push(field("Makerlog", String(user.makerlogHook), false));
    }
    if (user.wipApiKey) {
      fieldsAll.push(field("WIP", String(user.wipApiKey), false));
    }
    const name = `${user.emoji || "👨‍🌾"} ${user.name || user.username}`;
    const bio = user.bio || "Un jours je serais grand !";
    const thumb = image(user.avatarUrl);
    const userCard = embed(name, bio, user.color, fields, undefined, undefined, undefined, user.createdAt, thumb);
    const userCardAll = embed(name, "", user.color, fieldsAll, undefined, undefined, undefined, user.createdAt, thumb);
    console.log("interaction.application_id", interaction.application_id);
    return Promise.all([
      sendTxtLater("Voici tes infos !\n", [userCard], interaction.application_id, interaction.token),
      senChannel(interaction.channel_id, "Je t'ai envoyé plus d'info en privé 🤫"),
      openChannel(myId).then((channel) => senChannel(channel.id, "Voici tes infos Privée !\n", userCardAll)),
    ]).then(() => Promise.resolve());
  } else {
    return sendTxtLater(`Je n'ai pas trouvé le maker : ${userId}`, [], interaction.application_id, interaction.token);
  }
};

export const userFn = async (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId:string): Promise<void> => {
  if (option.name === "modifier" && option.options && option.options.length > 0) {
    return userEdit(interaction, option.options, senderId);
  } if (option.name === "liste") {
    return userList(interaction);
  } if (option.name === "flammes") {
    return userListStreak(interaction);
  } if (option.name === "voir" && option.options && option.options.length > 0) {
    return userView(interaction, senderId, option.options[0].value);
  } if (option.name === "voir") {
    return userView(interaction, senderId, undefined);
  }
  return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge`, [], interaction.application_id, interaction.token);
};
