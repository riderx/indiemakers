import {openDmChannel, sendDmChannel} from "./dm";
import {ApplicationCommandInteractionDataOption, Interaction} from "./create_command";
import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {getUserData, sendTxtLater} from "./utils";

export interface User {
  userId: string,
  avatar: string,
  username: string,
  avatarUrl: string,
  strikes: number,
  karma: number,
  projets: number,
  taches: number,
  website?: string,
  bio?: string,
  lastTaskAt?: string,
  makerlogHook?: string,
  wipApiKey?: string,
  createdAt: string,
  updatedAt: string
}
const userPublicKey = ["username", "karma", "avatarUrl", "taches", "projets", "strikes", "createdAt"];
const userProtectedKey = ["userId", "username", "karma", "avatar", "taches", "projets", "strikes", "createdAt", "updatedAt", "lastTaskAt"];

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
    console.error(err);
    return {users: [], total: 0};
  }
};

const transformKey = (key: string): string => {
  switch (key) {
    case "makerloghook":
      return "makerlogHook";
    case "wipapikey":
      return "wipApiKey";
    case "photo":
      return "avatarUrl";
    default:
      return key;
  }
};

export const getUsersById = async (userId: string): Promise<User | null> => {
  try {
    const res = await firestore().collection("discord").doc(userId).get();
    const data = res.data();
    return data !== undefined ? (data as User): null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateUser = async (userId: string, user: Partial<User>): Promise<firestore.WriteResult> => {
  const userDoc = await firestore().collection("discord").doc(userId).get();
  if (!userDoc.exists || !userDoc.data) {
    const userInfo = await getUserData(userId);
    const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.png`;
    const newUser: User = Object.assign({
      userId,
      avatar: userInfo.avatar,
      avatarUrl,
      strikes: 0,
      karma: 0,
      projets: 0,
      taches: 0,
      username: userInfo.username,
      createdAt: dayjs().toISOString(),
      updateAt: dayjs().toISOString(),
    }, user as User);
    return firestore().collection("discord").doc(userId).set(newUser);
  }
  return userDoc.ref.update({...user, updateAt: dayjs().toISOString()});
};

const userEdit = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], userId:string): Promise<void> => {
  const updatedUser: Partial<User> = {};
  options.forEach((element: any) => {
    if (!userProtectedKey.includes(element.name)) {
      (updateUser as any)[transformKey(element.name)] = element.value;
    }
  });
  console.log("userEdit", updateUser);
  return Promise.all([
    updateUser(userId, updatedUser),
    sendTxtLater("Tu as mis a jours ton profil !\n Cela aideras les autres makers a te connaitre !", interaction.application_id, interaction.token),
  ]).then(() => Promise.resolve());
};

const userList = async (interaction: Interaction): Promise<void> => {
  let usersInfo = "";

  const res = await getAllUsers();
  res.users.forEach((element: User) => {
    usersInfo += `${element.username} projets: ${element.projets} taches: ${element.taches} karma: ${element.karma} strikes: ${element.strikes}  Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
  });
  console.log("userList", usersInfo);
  return sendTxtLater(`Voici la liste des makers !\n\n${usersInfo}`, interaction.application_id, interaction.token);
};

const userView = async (interaction: Interaction, myId:string, userId:string|undefined): Promise<void> => {
  let userInfo = "";
  const user = await getUsersById(userId || myId);
  if (user && userId && myId !== userId) {
    Object.keys(user).forEach((element: string) => {
      if (userPublicKey.includes(element)) {
        userInfo += `${element} : ${(user as any)[element]}\n`;
      }
    });
    console.log("userEdit", userInfo);
    return sendTxtLater(`Voici les infos sur ce maker !\n${userInfo}`, interaction.application_id, interaction.token);
  } else if (user) {
    Object.keys(user).forEach((element: string) => {
      userInfo += `${element} : ${(user as any)[element]}\n`;
    });
    console.log("userEdit", userInfo);
    const channel = await openDmChannel(myId);
    Promise.all([sendDmChannel(channel.id, `Voici tes infos !\n${userInfo}`), sendTxtLater("Je t'ai envoyé tes info en privé 🤫", interaction.application_id, interaction.token)]);
    await sendDmChannel(channel.id, `Voici tes infos !\n${userInfo}`);
    return sendTxtLater("Je t'ai envoyé tes info en privé 🤫", interaction.application_id, interaction.token);
  } else {
    return sendTxtLater(`Je n'ai pas trouvé le maker : ${userId}`, interaction.application_id, interaction.token);
  }
};

export const userFn = async (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId:string): Promise<any> => {
  if (option.name === "modifier" && option.options && option.options.length > 0) {
    return userEdit(interaction, option.options, senderId);
  } if (option.name === "liste") {
    return userList(interaction);
  } if (option.name === "voir" && option.options && option.options.length > 0) {
    return userView(interaction, senderId, option.options[0].value);
  }
  return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge`, interaction.application_id, interaction.token);
};
