import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {sendTxtLater} from "./utils";
import {Response} from "express";

const getAllProjects = async (userId: string) => {
  const documents = await firestore().collection(`discord/${userId}/projects`).get();

  const users: any[] = documents.docs
      .map((doc) => doc.data());
  return users;
};
const getProjectsByID:any = async (userId: string, projectId: string) => (await firestore().collection(`discord/${userId}/projects`).doc(projectId).get()).data;

const updateProject = async (userId: string, project: any) => {
  const userDoc = await firestore().collection(`discord/${userId}/projects`).doc(project["hashtag"]).get();
  if (!userDoc.exists || !userDoc.data) {
    return firestore().collection(`discord/${userId}/projects`).doc(project["hashtag"]).set({...project, createdAt: dayjs().toISOString()});
  }
  return userDoc.ref.update({...project, updateAt: dayjs().toISOString()});
};

const deleteProject = async (userId: string, projectId: any) => {
  return firestore().collection(`discord/${userId}/projects`).doc(projectId).delete();
};

const deleteAllProjectsTasks = async (userId: string, projectId: string) => {
  try {
    const documents = await firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).get();
    const listDel: Promise<any>[] = [];
    documents.docs.forEach((doc) => {
      listDel.push(doc.ref.delete());
    });
    return Promise.all(listDel);
  } catch (err) {
    console.error("err", err);
    return Promise.resolve();
  }
};


const project_add = async (res:Response, interaction: any, options:any, senderId:string) => {
  const newProj: any = {};
  options.forEach((element: any) => {
    newProj[element.name] = element.value;
  });
  console.log("add project", newProj);
  await updateProject(senderId, newProj);
  return sendTxtLater("Tu as crée un nouveau projet !\nIl est temps de shiper ta premiere tache dessus 💪!", interaction.application_id, interaction.token);
};

const project_edit = async (res:Response, interaction: any, options:any, senderId:string) => {
  const newProj: any = {};
  options.forEach((element: any) => {
    newProj[element.name] = element.value;
  });
  console.log("project_edit", newProj);
  await updateProject(senderId, newProj);
  return sendTxtLater("Tu as mis a jours ton projet !\nBravo 💪, une marche après l'autre tu fais grandir ce projet!", interaction.application_id, interaction.token);
};

const project_list_other = async (res:Response, interaction: any, userId:string) => {
  let projsInfo = "";

  const proj = await getAllProjects(userId);
  Object.keys(proj);
  proj.forEach((element: any) => {
    projsInfo += `${element.name} #${element.hashtag} Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
  });
  console.log("project_list", projsInfo);
  return sendTxtLater(`Voici la liste des projets de <@${userId}> !\n\n${projsInfo}`, interaction.application_id, interaction.token);
};

const project_list_me = async (res:Response, interaction: any, senderId:string) => {
  let projsInfo = "";
  const proj = await getAllProjects(senderId);
  Object.keys(proj);
  proj.forEach((element: any) => {
    projsInfo += `${element.name} #${element.hashtag} Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
  });
  console.log("project_list", projsInfo);
  return sendTxtLater(`Voici la liste de tes projets !\n${projsInfo}`, interaction.application_id, interaction.token);
};

const project_view = async (res:Response, interaction: any, option:any, senderId:string) => {
  let projInfo = "";
  const proj = await getProjectsByID(senderId, option.value);
  Object.keys(proj).forEach((element: any) => {
    projInfo += `${proj[element].name} : ${proj[element].value}\n`;
  });
  console.log("project_edit", projInfo);
  return sendTxtLater(`Voici les infos sur ton projet !\n${projInfo}`, interaction.application_id, interaction.token);
};

const project_delete = async (res:Response, interaction: any, option:any, senderId:string) => {
  const projId = option.value;
  console.log("project_delete", projId);
  await deleteProject(senderId, projId);
  await deleteAllProjectsTasks(senderId, projId);
  return sendTxtLater(`Tu as supprimé ton projet ${projId} et ses taches !\nSavoir terminer un projet est une force!`, interaction.application_id, interaction.token);
};


export const projetc_fn = async (res:Response, interaction:any, option:any, senderId:string) => {
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
  return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge`, interaction.application_id, interaction.token);
};
