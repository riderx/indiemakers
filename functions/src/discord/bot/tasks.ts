import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {sendTxtLater} from "./utils";
import {updateUser, User, getUsersById} from "./user";

import {sendToWip, updateToWip} from "./wip";
import {sendToMakerlog} from "./makerlog";
import {getAllProjects, Project, updateProject} from "./project";
import {Interaction, ApplicationCommandInteractionDataOption} from "./create_command";

enum TaskStatus {
  TODO = "A faire",
  DONE = "Fait",
}
interface Task {
  id?: string,
  content: string,
  status: TaskStatus,
  doneAt?: string,
  wipId?: string,
  makerlogHook?: string,
  createdAt: string,
  updatedAt: string,
}

const createProjectTask = async (user: User, projectId: string, task: Partial<Task>): Promise<firestore.DocumentReference<firestore.DocumentData>> => {
  try {
    const done = task.status === "A faire" ? false : true;
    if (user?.makerlogHook && task?.content) {
      task.makerlogHook = await sendToMakerlog(user.makerlogHook, task.content, done);
    }
    if (user?.wipApiKey && task?.content) {
      task.wipId = await sendToWip(user.wipApiKey, task.content, done);
    }
  } catch (err) {
    console.error(err);
  }
  return firestore().collection(`discord/${user.userId}/projects/${projectId}/tasks`).add({...task, createdAt: dayjs().toISOString()});
};

const deleteProjectTask = async (userId: string, projectId: string, taskId:string): Promise<firestore.WriteResult> => {
  return firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).doc(taskId).delete();
};

const updateProjectTask = async (userId: string, projectId: string, taskId:string, task: Partial<Task>): Promise<firestore.WriteResult> => {
  try {
    const user = await getUsersById(userId);
    const done = task.status === "A faire" ? false : true;
    if (task?.makerlogHook && task?.content) {
      task.makerlogHook = await sendToMakerlog(task.makerlogHook, task.content, done);
    }
    if (user?.wipApiKey && task?.wipId && task?.content) {
      task.wipId = await updateToWip(user.wipApiKey, task.wipId, task.content, done);
    }
  } catch (err) {
    console.error(err);
  }
  return firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).doc(taskId).update({...task, updatesAt: dayjs().toISOString()});
};

const getAllProjectsTasks = async (userId: string, projectId: string): Promise<{tasks: Task[], total: number}> => {
  try {
    const documents = await firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).get();
    const tasks: Task[] = [];
    documents.docs
        .map((doc) => {
          const data = (doc.data() as Task);
          if (data !== undefined) {
            tasks.push({id: doc.id, ...data});
          }
        });
    return {tasks, total: tasks.length};
  } catch (err) {
    console.error("err", err);
    return {tasks: [], total: 0};
  }
};

const taskAdd = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], userId:string): Promise<void> => {
  let projectId = "";
  const task: Partial<Task> = {
    status: TaskStatus.DONE,
  };
  options.forEach((element: any) => {
    if (element.name === "hashtag") {
      projectId = element.value;
    } else if (element.name === "content") {
      task["content"] = element.value;
    } else if (element.name === "status") {
      task["status"] = element.value;
    }
  });
  const curUser = await getUsersById(userId);
  if (curUser) {
    const curTasks = await getAllProjectsTasks(userId, projectId);
    await createProjectTask(curUser, projectId, task);
    const updatedProject: Partial<Project> = {
      taches: curTasks.total + 1,
      lastTaskAt: dayjs().toISOString(),
    };
    const superTotal = await getTotalTaskByUser(userId);
    const updatedUser: Partial<User> = {
      taches: superTotal,
      lastTaskAt: dayjs().toISOString(),
    };
    const lastDay = dayjs();
    lastDay.subtract(1, "day");
    lastDay.set("minute", 0);
    lastDay.set("hour", 0);
    lastDay.set("second", 0);
    if (curUser.lastTaskAt && dayjs(curUser.lastTaskAt).isAfter(lastDay)) {
      updatedProject.strikes = curUser.strikes ? curUser.strikes + 1 : 1;
      updatedUser.strikes = curUser.strikes ? curUser.strikes + 1 : 1;
    } else {
      updatedProject.strikes = 0;
      updatedUser.strikes = 0;
    }
    await updateProject(userId, projectId, updatedProject);
    await updateUser(userId, updatedUser);
    return sendTxtLater(`La tache a été ajouté au projet #${projectId}, 🎉!`, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater("Le Maker est introuvable 🤫!", interaction.application_id, interaction.token);
  }
};

const taskEdit = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], userId:string): Promise<void> => {
  let projectId = "";
  const task: Partial<Task> = {
    status: TaskStatus.DONE,
  };
  let taskId = "";
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (element.name === "hashtag" && element.value) {
      projectId = element.value;
    } else if (element.name === "id" && element.value) {
      taskId = element.value;
    } else if (element.name === "content" && element.value) {
      task["content"] = element.value;
    } else if (element.name === "status" && element.value) {
      task["status"] = element.value as TaskStatus;
    }
  });
  await updateProjectTask(userId, projectId, taskId, task);
  return sendTxtLater(`La tache ${taskId} a été mise a jours dans le projet #${projectId}, 🎉!`, interaction.application_id, interaction.token);
};

const tasksView = async (interaction: Interaction, option:ApplicationCommandInteractionDataOption, userId:string): Promise<void> => {
  const projectId = option.value;
  if (projectId) {
    const allTaks = await getAllProjectsTasks(userId, projectId);
    let taskInfos = `Tu a fait un total de ${allTaks.total} sur ce projet, BRAVO 🎉!\n\nVoici La liste:\n`;
    allTaks.tasks.forEach((element: any) => {
      taskInfos += `${element.text} . Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
    });
    return sendTxtLater(taskInfos, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater("Donne moi un projet !", interaction.application_id, interaction.token);
  }
};

const getTotalTaskByUser = async (userId: string): Promise<number> => {
  const res = await getAllProjects(userId);
  return res.projects.reduce((tt, project) => tt + project.taches, 0);
};

const tasksDelete = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], userId:string): Promise<void> => {
  let projectId = "";
  let taskId = "";
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (element.name === "hashtag" && element.value) {
      projectId = element.value;
    } else if (element.name === "id" && element.value) {
      taskId = element.value;
    }
  });
  await deleteProjectTask(userId, projectId, taskId);
  const curTasks = await getAllProjectsTasks(userId, projectId);
  const superTotal = await getTotalTaskByUser(userId);
  const updatedUser: Partial<User> = {
    taches: superTotal,
    lastTaskAt: dayjs().toISOString(),
  };
  await updateUser(userId, updatedUser);
  await updateUser(userId, {taches: curTasks.total + 1});
  return sendTxtLater(`Tu as supprimé la tache ${taskId} !`, interaction.application_id, interaction.token);
};

export const taskFn = async (interaction: Interaction, option: ApplicationCommandInteractionDataOption, userId:string): Promise<void> => {
  if (option.name === "ajouter" && option.options && option.options.length > 0) {
    await taskAdd(interaction, option.options, userId);
    return Promise.resolve();
  } if (option.name === "liste" && option.options && option.options.length > 0) {
    await tasksView(interaction, option.options[0], userId);
    return Promise.resolve();
  } if (option.name === "modifier" && option.options && option.options.length > 0) {
    await taskEdit(interaction, option.options, userId);
    return Promise.resolve();
  } if (option.name === "supprimer" && option.options && option.options.length > 0) {
    await tasksDelete(interaction, option.options, userId);
    return Promise.resolve();
  }
};
