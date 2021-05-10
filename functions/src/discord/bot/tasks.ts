import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {sendTxtLater} from "./utils";
import {Response} from "express";

const createProjectTask = async (userId: string, projectId: string, task: any) => {
  return firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).add({...task, createdAt: dayjs().toISOString()});
};

const deleteProjectTask = async (userId: string, projectId: string, taskId:string) => {
  return firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).doc(taskId).delete();
};

const updateProjectTask = async (userId: string, projectId: string, taskId:string, task: any) => {
  return firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).doc(taskId).update({...task, updatesAt: dayjs().toISOString()});
};

const updateProjecttotalTask = async (userId: string, projectId: string, totalTask: number) => {
  const projDoc = await firestore().collection(`discord/${userId}/projects/`).doc(projectId).get();
  if (!projDoc.exists || !projDoc.data) {
    console.error(`Cannot add total to userId: ${userId}, projectId: ${projectId}, totalTask: ${totalTask}`);
  }
  return projDoc.ref.update({totalTask, updateAt: dayjs().toISOString()});
};

const getAllProjectsTasks = async (userId: string, projectId: string) => {
  try {
    const documents = await firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).get();
    const tasks: any[] = documents.docs
        .map((doc) => ({docId: doc.id, ...doc.data()}));
    const total = tasks.reduce((tt, current) => tt + current.value, 0);
    return {tasks, total};
  } catch (err) {
    console.error("err", err);
    return {tasks: [], total: 0};
  }
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
  return sendTxtLater(`La tache a été ajouté au projet #${projectId}, 🎉!`, interaction.application_id, interaction.token);
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
  return sendTxtLater(`La tache ${taskId} a été mise a jours dans le projet #${projectId}, 🎉!`, interaction.application_id, interaction.token);
};

const tasks_view = async (res:Response, interaction: any, option:any, senderId:string) => {
  const projectId = option.value;
  const allTaks = await getAllProjectsTasks(senderId, projectId);
  let taskInfos = `Tu a fait un total de ${allTaks.total} sur ce projet, BRAVO 🎉!\n\nVoici La liste:\n`;
  allTaks.tasks.forEach((element: any) => {
    taskInfos += `${element.text} . Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
  });
  return sendTxtLater(taskInfos, interaction.application_id, interaction.token);
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
  return sendTxtLater(`Tu as supprimé la tache ${taskId} !\nUne erreur a du se glisser ici!`, interaction.application_id, interaction.token);
};

export const task_fn = async (res:Response, interaction:any, option:any, senderId:string) => {
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
