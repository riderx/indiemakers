import {InteractionResponseType, InteractionType, verifyKey} from "discord-interactions";
import {firestore} from "firebase-admin";
// import {config, firestore} from "firebase-admin";
import {Request, Response} from "express";
import axios from "axios";
import dayjs from "dayjs";

const CLIENT_PUBLIC_KEY = "76a1cf12caec747f872ee6ea064269d4acd2538b2f1e26f89853f93c32d045db";

const getAllKarma = async () => {
  const documents = await firestore().collection("karma").get();

  const users: any[] = documents.docs
      .map((doc) => doc.data());
  return users;
};

const getAllProjects = async (userId: string) => {
  const documents = await firestore().collection(`karma/${userId}/projects`).get();

  const users: any[] = documents.docs
      .map((doc) => doc.data());
  return users;
};
const getProjectsByID:any = async (userId: string, projectId: string) => (await firestore().collection(`karma/${userId}/projects`).doc(projectId).get()).data;

const updateProject = async (userId: string, project: any) => {
  const userDoc = await firestore().collection(`karma/${userId}/projects`).doc(project["hashtag"]).get();
  if (!userDoc.exists || !userDoc.data) {
    return firestore().collection(`karma/${userId}/projects`).doc(project["hashtag"]).set({...project, createdAt: dayjs().toISOString()});
  }
  return userDoc.ref.update({...project, updateAt: dayjs().toISOString()});
};

const deleteProject = async (userId: string, projectId: any) => {
  return firestore().collection(`karma/${userId}/projects`).doc(projectId).delete();
};

// const res = await db.collection('cities').doc('DC').delete();
const createProjectTask = async (userId: string, projectId: string, task: any) => {
  return firestore().collection(`karma/${userId}/projects/${projectId}/tasks`).add({...task, createdAt: dayjs().toISOString()});
};

const deleteProjectTask = async (userId: string, projectId: string, taskId:string) => {
  return firestore().collection(`karma/${userId}/projects/${projectId}/tasks`).doc(taskId).delete();
};

const updateProjectTask = async (userId: string, projectId: string, taskId:string, task: any) => {
  return firestore().collection(`karma/${userId}/projects/${projectId}/tasks`).doc(taskId).update({...task, updatesAt: dayjs().toISOString()});
};

const updateProjecttotalTask = async (userId: string, projectId: string, totalTask: number) => {
  const projDoc = await firestore().collection(`karma/${userId}/projects/`).doc(projectId).get();
  if (!projDoc.exists || !projDoc.data) {
    console.error(`Cannot add total to userId: ${userId}, projectId: ${projectId}, totalTask: ${totalTask}`);
  }
  return projDoc.ref.update({totalTask, updateAt: dayjs().toISOString()});
};

const deleteAllProjectsTasks = async (userId: string, projectId: string) => {
  const documents = await firestore().collection(`karma/${userId}/projects/${projectId}/tasks`).get();
  const listDel: Promise<any>[] = [];
  try {
    documents.docs.forEach((doc) => {
      listDel.push(doc.ref.delete());
    });
    return Promise.all(listDel);
  } catch (err) {
    console.error("err", err);
    return Promise.resolve();
  }
};

const getAllProjectsTasks = async (userId: string, projectId: string) => {
  const documents = await firestore().collection(`karma/${userId}/projects/${projectId}/tasks`).get();

  try {
    const tasks: any[] = documents.docs
        .map((doc) => ({docId: doc.id, ...doc.data()}));
    const total = tasks.reduce((tt, current) => tt + current.value, 0);
    return {tasks, total};
  } catch (err) {
    console.error("err", err);
    return {tasks: [], total: 0};
  }
};

const getKarmaById = async (id: string) => {
  const documents = await firestore().collection(`karma/${id}/votes`).get();

  try {
    const votes: any[] = documents.docs
        .map((doc) => ({docId: doc.id, ...doc.data()}));
    const total = votes.reduce((tt, current) => tt + current.value, 0);
    return {votes, total};
  } catch (err) {
    console.error("err", err);
    return {votes: [], total: 0};
  }
};

const addKarmaVotesById = (userId: string, senderId: string, value: number) => firestore().collection(`karma/${userId}/votes`).add({userId: senderId, value, createdAt: dayjs().toISOString()});

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

const sendTxt = (res:Response, text:string) => res.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: text,
  },
});

const sendTxtLater = async (res:Response, text:string, application_id:string, interaction_token: string) => {
  const url = `https://discord.com/api/v8/webhooks/${application_id}/${interaction_token}/messages/@original`;
  return axios.patch(url,
      {
        content: text,
      }, {}).catch((err) => {
    console.error(err);
  });
};

const getUserData: any = (userId:string) => {
  const url = `https://discord.com/api//v8/users/${userId}`;
  const headers = {
    // "Authorization": `Bot ${config().discord.bot_token}`
    "Authorization": "Bot ODM2NzIwNTI0MzUyNDIxOTE5.YIiGtg.g3MkGZORTh1EO75OASRL2Ekw4dw",
  };
  return axios.get(url, {headers}).catch((err) => {
    console.error(err);
    return {};
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

const project_add = async (res:Response, interaction: any, options:any, senderId:string) => {
  const newProj: any = {};
  options.forEach((element: any) => {
    newProj[element.name] = element.value;
  });
  console.log("add project", newProj);
  await updateProject(senderId, newProj);
  return sendTxtLater(res, "Tu as crée un nouveau projet !\nIl est temps de shiper ta premiere tache dessus 💪!", interaction.application_id, interaction.token);
};

const project_edit = async (res:Response, interaction: any, options:any, senderId:string) => {
  const newProj: any = {};
  options.forEach((element: any) => {
    newProj[element.name] = element.value;
  });
  console.log("project_edit", newProj);
  await updateProject(senderId, newProj);
  return sendTxtLater(res, "Tu as mis a jours ton projet !\nBravo 💪, une marche après l'autre tu fais grandir ce projet!", interaction.application_id, interaction.token);
};

const project_list_other = async (res:Response, interaction: any, userId:string) => {
  let projsInfo = "";

  const proj = await getAllProjects(userId);
  Object.keys(proj);
  proj.forEach((element: any) => {
    projsInfo += `${element.name} #${element.hashtag} Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
  });
  console.log("project_list", projsInfo);
  return sendTxtLater(res, `Voici la liste des projets de <@${userId}> !\n\n${projsInfo}`, interaction.application_id, interaction.token);
};

const project_list_me = async (res:Response, interaction: any, senderId:string) => {
  let projsInfo = "";
  const proj = await getAllProjects(senderId);
  Object.keys(proj);
  proj.forEach((element: any) => {
    projsInfo += `${element.name} #${element.hashtag} Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
  });
  console.log("project_list", projsInfo);
  return sendTxtLater(res, `Voici la liste de tes projets !\n${projsInfo}`, interaction.application_id, interaction.token);
};

const project_view = async (res:Response, interaction: any, option:any, senderId:string) => {
  let projInfo = "";
  const proj = await getProjectsByID(senderId, option.value);
  Object.keys(proj).forEach((element: any) => {
    projInfo += `${proj[element].name} : ${proj[element].value}\n`;
  });
  console.log("project_edit", projInfo);
  return sendTxtLater(res, `Voici les infos sur ton projet !\n${projInfo}`, interaction.application_id, interaction.token);
};

const project_delete = async (res:Response, interaction: any, option:any, senderId:string) => {
  const projId = option.value;
  console.log("project_delete", projId);
  await deleteProject(senderId, projId);
  await deleteAllProjectsTasks(senderId, projId);
  return sendTxtLater(res, `Tu as supprimé ton projet ${projId} et ses taches !\nSavoir terminer un projet est une force!`, interaction.application_id, interaction.token);
};

const task_add = async (res:Response, interaction: any, options:any, senderId:string) => {
  let projectId = "";
  let task = "";
  options.forEach((element: any) => {
    if (element.name === "hashtag") {
      projectId = element.value;
    } else if (element.name === "titre") {
      task = element.value;
    }
  });
  const curTasks = await getAllProjectsTasks(senderId, projectId);
  await createProjectTask(senderId, projectId, {text: task});
  await updateProjecttotalTask(senderId, projectId, curTasks.total + 1);
  return sendTxtLater(res, `La tache a été ajouté au projet #${projectId}, 🎉!`, interaction.application_id, interaction.token);
};

const task_edit = async (res:Response, interaction: any, options:any, senderId:string) => {
  let projectId = "";
  let task = "";
  let taskId = "";
  options.forEach((element: any) => {
    if (element.name === "hashtag") {
      projectId = element.value;
    } else if (element.name === "titre") {
      task = element.value;
    } else if (element.name === "id") {
      taskId = element.value;
    }
  });
  await updateProjectTask(senderId, projectId, taskId, {text: task});
  return sendTxtLater(res, `La tache ${taskId} a été mise a jours dans le projet #${projectId}, 🎉!`, interaction.application_id, interaction.token);
};

const tasks_view = async (res:Response, interaction: any, option:any, senderId:string) => {
  const projectId = option.value;
  const allTaks = await getAllProjectsTasks(senderId, projectId);
  let taskInfos = `Tu a fait un total de ${allTaks.total} sur ce projet, BRAVO 🎉!\n\nVoici La liste:\n`;
  allTaks.tasks.forEach((element: any) => {
    taskInfos += `${element.text} . Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
  });
  return sendTxtLater(res, taskInfos, interaction.application_id, interaction.token);
};

const tasks_delete = async (res:Response, interaction: any, options:any, senderId:string) => {
  let projectId = "";
  let taskId = "";
  options.forEach((element: any) => {
    if (element.name === "hashtag") {
      projectId = element.value;
    } else if (element.name === "id") {
      taskId = element.value;
    }
  });
  await deleteProjectTask(senderId, projectId, taskId);
  const curTasks = await getAllProjectsTasks(senderId, projectId);
  await updateProjecttotalTask(senderId, projectId, curTasks.total);
  return sendTxtLater(res, `Tu as supprimé la tache ${taskId} !\nUne erreur a du se glisser ici!`, interaction.application_id, interaction.token);
};

const task_fn = async (res:Response, interaction:any, option:any, senderId:string) => {
  if (option.name === "ajouter" && option.options.length > 0) {
    await task_add(res, interaction, option.options, senderId);
    return Promise.resolve() as any;
  } if (option.name === "liste" && option.options.length > 0) {
    await tasks_view(res, interaction, option.options[0], senderId);
    return Promise.resolve() as any;
  } if (option.name === "modifier" && option.options.length > 0) {
    await task_edit(res, interaction, option.options, senderId);
    return Promise.resolve() as any;
  } if (option.name === "supprimer" && option.options.length > 0) {
    await tasks_delete(res, interaction, option.options, senderId);
    return Promise.resolve() as any;
  }
};

const projetc_fn = async (res:Response, interaction:any, option:any, senderId:string) => {
  if (option.name === "creer" && option.options.length > 0) {
    await project_add(res, interaction, option.options, senderId);
    return Promise.resolve() as any;
  } if (option.name === "modifier" && option.options.length > 0) {
    await project_edit(res, interaction, option.options, senderId);
    return Promise.resolve() as any;
  } if (option.name === "liste" && option.options.length > 0) {
    await project_list_other(res, interaction, option.options[0].value);
    return Promise.resolve() as any;
  } if (option.name === "liste") {
    await project_list_me(res, interaction, senderId);
    return Promise.resolve() as any;
  } if (option.name === "voir" && option.options.length > 0) {
    await project_view(res, interaction, option.options, senderId);
    return Promise.resolve() as any;
  } if (option.name === "supprimer" && option.options.length > 0) {
    await project_delete(res, interaction, option.options[0], senderId);
    return Promise.resolve() as any;
  }
  return sendTxtLater(res, `La Commande ${option.name} n'est pas pris en charge`, interaction.application_id, interaction.token);
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
  if (option.name === "projet" && option.options.length > 0) {
    await sendTxtLoading(res);
    return projetc_fn(res, interaction, option.options[0], senderId);
  }
  if (option.name === "tache" && option.options.length > 0) {
    await sendTxtLoading(res);
    return task_fn(res, interaction, option.options[0], senderId);
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
