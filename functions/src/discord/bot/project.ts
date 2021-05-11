import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {sendTxtLater} from "./utils";
import {updateUser} from "./user";
import {Interaction, ApplicationCommandInteractionDataOption} from "./create_command";

export interface Project {
  id?: string,
  createdAt: string,
  updateAt: string,
  hashtag: string,
  nom: string,
  pitch?: string,
  taches: number,
  strikes: number,
  lastTaskAt?:string,
  website?: string,
  stripeKey?: string,
}
const projectPublicKey = ["hashtag", "nom", "pitch", "taches", "strikes", "website"];
const projectProtectedKey = ["taches", "strikes", "createdAt", "updatedAt", "lastTaskAt"];

export const getAllProjects = async (userId: string): Promise<{projects: Project[], total: number}> => {
  try {
    const documents = await firestore().collection(`discord/${userId}/projects`).get();

    const projects: Project[] = [];
    documents.docs
        .forEach((doc) => {
          const data = (doc.data() as Project);
          if (data !== undefined) {
            projects.push({id: doc.id, ...(data as Project)});
          }
        });
    const total = projects.reduce((tt, current) => tt + current.taches, 0);
    return {projects, total};
  } catch (err) {
    console.error(err);
    return {projects: [], total: 0};
  }
};

export const getProjectById = async (userId: string, projectId: string): Promise<Project | null> => {
  try {
    const res = await firestore().collection(`discord/${userId}/projects`).doc(projectId).get();
    const data = res.data();
    return data !== undefined ? (data as Project): null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateProject = async (userId: string, hashtag: string, project: Partial<Project>): Promise<firestore.WriteResult> => {
  const userDoc = await firestore().collection(`discord/${userId}/projects`).doc(hashtag).get();
  if (!userDoc.exists || !userDoc.data) {
    const newProject: Project = Object.assign({
      hashtag: "",
      nom: "",
      taches: 0,
      strikes: 0,
      updateAt: dayjs().toISOString(),
      createdAt: dayjs().toISOString(),
    }, project);
    return firestore().collection(`discord/${userId}/projects`).doc(hashtag).set(newProject);
  }
  return userDoc.ref.update({...project, updateAt: dayjs().toISOString()});
};

const deleteProject = async (userId: string, projectId: string): Promise<firestore.WriteResult> => {
  return firestore().collection(`discord/${userId}/projects`).doc(projectId).delete();
};

export const deleteAllProjectsTasks = async (userId: string, projectId: string): Promise<void> => {
  try {
    const documents = await firestore().collection(`discord/${userId}/projects/${projectId}/tasks`).get();
    const listDel: Promise<firestore.WriteResult>[] = [];
    documents.docs.forEach((doc) => {
      listDel.push(doc.ref.delete());
    });
    await Promise.all(listDel);
    return Promise.resolve();
  } catch (err) {
    console.error("err", err);
    return Promise.resolve();
  }
};

const projectAdd = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], senderId:string): Promise<void> => {
  const newProj: Partial<Project> = {};
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    (newProj as any)[element.name] = element.value;
  });
  if (newProj["hashtag"]) {
    console.log("add project", newProj);
    const allProj = await getAllProjects(senderId);
    await updateProject(senderId, newProj["hashtag"], newProj);
    await updateUser(senderId, {projets: allProj.total + 1});
    return sendTxtLater(`Tu as crée le projet:\n#${newProj["hashtag"]} 👏\nIl est temps de shiper ta premiere tache dessus 💪!`, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater("hashtag manquant!", interaction.application_id, interaction.token);
  }
};

const projectEdit = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], senderId:string): Promise<void> => {
  const newProj: Partial<Project> = {};
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (!projectProtectedKey.includes(element.name)) {
      (newProj as any)[element.name] = element.value;
    }
  });
  if (newProj["hashtag"]) {
    console.log("projectEdit", newProj);
    await updateProject(senderId, newProj["hashtag"], newProj);
    return sendTxtLater(`Tu as mis a jours le projet:\n#${newProj["hashtag"]}\nBravo 💪, une marche après l'autre tu fais grandir ce projet!`, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater("hashtag manquant!", interaction.application_id, interaction.token);
  }
};

const projectList = async (interaction: Interaction, userId:string, me= false): Promise<void> => {
  let projsInfo = "";
  const proj = await getAllProjects(userId);
  proj.projects.forEach((proj: Project) => {
    projsInfo += `${proj.nom} #${proj.hashtag} taches:${proj.taches} strikes:${proj.strikes} Crée le ${dayjs(proj.createdAt).format("DD/MM/YYYY")}\n`;
  });
  console.log("project_list", projsInfo);
  const sentence = me ? "Voici la liste de tes projets !" : "Voici la liste des projets de <@${userId}> !";
  return sendTxtLater(`${sentence}\n\n${projsInfo}`, interaction.application_id, interaction.token);
};

const projectView = async (interaction: Interaction, projId:string, senderId:string): Promise<void> => {
  let projInfo = "";
  if (projId) {
    const project = await getProjectById(senderId, projId);
    if (project) {
      Object.keys(project).forEach((element: string) => {
        if (projectPublicKey.includes(element)) {
          projInfo += `${(project as any)[element].name} : ${(project as any)[element].value}\n`;
        }
      });
    }
    console.log("projectEdit", projInfo);
    return sendTxtLater(`Voici les infos sur ton projet !\n${projInfo}`, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater("Donne moi un projet !", interaction.application_id, interaction.token);
  }
};

const projectDelete = async (interaction: Interaction, option:ApplicationCommandInteractionDataOption, senderId:string): Promise<void> => {
  const projId = option.value;
  if (projId) {
    console.log("projectDelete", projId);
    await deleteProject(senderId, projId);
    await deleteAllProjectsTasks(senderId, projId);
    return sendTxtLater(`Tu as supprimé ton projet ${projId} et ses taches !\nSavoir terminer un projet est une force!`, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater("Donne moi un projet !", interaction.application_id, interaction.token);
  }
};


export const projectFn = async (interaction:Interaction, option:ApplicationCommandInteractionDataOption, senderId:string): Promise<void> => {
  if (option.name === "creer" && option.options && option.options.length > 0) {
    await projectAdd(interaction, option.options, senderId);
    return Promise.resolve();
  } if (option.name === "modifier" && option.options && option.options.length > 0) {
    await projectEdit(interaction, option.options, senderId);
    return Promise.resolve();
  } if (option.name === "liste" && option.options && option.options.length > 0 && option.options[0].value) {
    await projectList(interaction, option.options[0].value);
    return Promise.resolve();
  } if (option.name === "liste") {
    await projectList(interaction, senderId, true);
    return Promise.resolve();
  } if (option.name === "voir" && option.options && option.options.length > 0 && option.options[0].value) {
    await projectView(interaction, option.options[0].value, senderId);
    return Promise.resolve();
  } if (option.name === "supprimer" && option.options && option.options.length > 0) {
    await projectDelete(interaction, option.options[0], senderId);
    return Promise.resolve();
  }
  return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge`, interaction.application_id, interaction.token);
};
