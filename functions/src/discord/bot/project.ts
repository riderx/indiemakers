import {getStripeCharges, Charge} from "./stripe_charges";
import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {sendTxtLater} from "./utils";
import {updateUser} from "./user";
import {Interaction, ApplicationCommandInteractionDataOption} from "../create_command";
import {createProjectIncome, deleteProjectIncome, getAllProjectsIncomes, Income} from "./income";

export interface Project {
  id?: string,
  createdAt: string,
  updatedAt?: string,
  hashtag: string,
  nom: string,
  pitch?: string,
  taches: number,
  flammes: number,
  lastTaskAt?:string,
  website?: string,
  stripeHook?: string,
}
const projectPublicKey = ["hashtag", "nom", "pitch", "taches", "flammes", "website"];
const projectProtectedKey = ["taches", "flammes", "createdAt", "updatedAt", "lastTaskAt"];

const transformKey = (key: string): string => {
  switch (key) {
    case "stripe_hook":
      return "stripeHook";
    default:
      return key;
  }
};

export const getAllProjects = async (userId: string): Promise<Project[]> => {
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
    return projects;
  } catch (err) {
    console.error("getAllProjects", err);
    return [];
  }
};

export const getProjectById = async (userId: string, projectId: string): Promise<Project | null> => {
  try {
    const res = await firestore().collection(`discord/${userId}/projects`).doc(projectId).get();
    const data = res.data();
    return data !== undefined ? (data as Project): null;
  } catch (err) {
    console.error("getProjectById", err);
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
      flammes: 0,
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
    console.error("deleteAllProjectsTasks", err);
    return Promise.resolve();
  }
};

const getPastCharges = async (userId: string, projectId: string| undefined) => {
  if (!projectId) return Promise.resolve();
  const charges: Charge[] = await getStripeCharges(projectId);
  const incomes: {[key: string]: Income} = {};
  const all: Promise<any>[] = [];
  charges.forEach((charge) => {
    const dateKey = dayjs(charge.date).format("MM_YYYY");
    if (incomes[dateKey]) {
      const newAmmount = incomes[dateKey].ammount + charge.ammount;
      incomes[dateKey] = {
        ammount: Math.abs(newAmmount),
        status: newAmmount >= 0 ? "income" : "expense",
        date: charge.date,
        stripeCharges: incomes[dateKey].stripeCharges?.concat([
          {
            id: charge.stripeId,
            ammount: charge.ammount,
            status: charge.status,
            date: charge.date,
          },
        ]),
      };
    } else {
      incomes[dateKey] = {
        ammount: charge.ammount,
        status: charge.status,
        date: charge.date,
        stripeCharges: [
          {
            id: charge.stripeId,
            ammount: charge.ammount,
            status: charge.status,
            date: charge.date,
          },
        ],
      };
    }
  });
  Object.keys(incomes).forEach((InKey: string) => {
    all.push(createProjectIncome(userId, projectId, incomes[InKey]));
  });
  Promise.all(all).then(() => Promise.resolve());
};

const cleanPastStripe = async (userId: string, projectId: string| undefined) => {
  if (!projectId) return Promise.resolve();
  const res = await getAllProjectsIncomes(userId, projectId);
  const all: Promise<any>[] = [];
  res.incomes.forEach((income) => {
    if (income.id && income.stripeCharges) {
      all.push(deleteProjectIncome(userId, projectId, income.id));
    }
  });
  Promise.all(all).then(() => Promise.resolve());
};

const addStripe = (userId: string, projectId: string| undefined, stripeHook: string| undefined) => {
  if (!stripeHook) {
    return Promise.resolve();
  }
  return getPastCharges(userId, projectId);
};

const updateStripe = (userId: string, projectId: string| undefined, stripeHook: string| undefined) => {
  if (!stripeHook) {
    return Promise.resolve();
  }
  if (stripeHook && !stripeHook.startsWith("rk_live")) {
    return cleanPastStripe(userId, projectId);
  }
  return cleanPastStripe(userId, projectId).then(() => getPastCharges(userId, projectId));
};

const projectAdd = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], userId:string): Promise<void> => {
  const newProj: Partial<Project> = {
    createdAt: dayjs().toISOString(),
  };

  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    (newProj as any)[transformKey(element.name)] = element.value;
  });
  if (newProj["hashtag"]) {
    console.log("add project", newProj);
    return Promise.all([
      sendTxtLater(`Tu as crée le projet:\n#${newProj["hashtag"]} 👏\nIl est temps de shiper ta premiere tache dessus 💪!`, interaction.application_id, interaction.token),
      addStripe(userId, newProj["hashtag"], newProj["stripeHook"]),
      updateProject(userId, newProj["hashtag"], newProj),
      getAllProjects(userId).then((allProj) => updateUser(userId, {projets: allProj.length + 1})),
    ]).then(() => Promise.resolve());
  } else {
    return sendTxtLater("hashtag manquant!", interaction.application_id, interaction.token);
  }
};

const projectEdit = async (interaction: Interaction, options:ApplicationCommandInteractionDataOption[], userId:string): Promise<void> => {
  const update: Partial<Project> = {
    updatedAt: dayjs().toISOString(),
  };
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (!projectProtectedKey.includes(transformKey(element.name))) {
      (update as any)[transformKey(element.name)] = element.value;
    }
  });
  if (update["hashtag"]) {
    console.log("projectEdit", update);
    return Promise.all([
      sendTxtLater(`Tu as mis a jours le projet:\n#${update["hashtag"]}\nBravo 💪, une marche après l'autre tu fais grandir ce projet!`, interaction.application_id, interaction.token),
      updateStripe(userId, update["hashtag"], update["stripeHook"]),
      updateProject(userId, update["hashtag"], update),
    ]).then(() => Promise.resolve());
  } else {
    return sendTxtLater("hashtag manquant!", interaction.application_id, interaction.token);
  }
};

const projectList = async (interaction: Interaction, userId:string, me= false): Promise<void> => {
  let projsInfo = "";
  const projects = await getAllProjects(userId);
  projects.forEach((proj: Project) => {
    projsInfo += `${proj.nom} #${proj.hashtag} taches:${proj.taches} flammes:${proj.flammes} Crée le ${dayjs(proj.createdAt).format("DD/MM/YYYY")}\n`;
  });
  console.log("project_list", projsInfo);
  const sentence = me ? "Voici la liste de tes projets !" : "Voici la liste des projets de <@${userId}> !";
  return sendTxtLater(`${sentence}\n\n${projsInfo}`, interaction.application_id, interaction.token);
};

const projectView = async (interaction: Interaction, projId:string, userId:string): Promise<void> => {
  let projInfo = "";
  if (projId) {
    const project = await getProjectById(userId, projId);
    if (project) {
      Object.keys(project).forEach((element: string) => {
        if (projectPublicKey.includes(element)) {
          projInfo += `${element} : ${(project as any)[element]}\n`;
        }
      });
    }
    console.log("projectEdit", projInfo);
    return sendTxtLater(`Voici les infos sur ton projet !\n${projInfo}`, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater("Donne moi un projet !", interaction.application_id, interaction.token);
  }
};

const projectDelete = async (interaction: Interaction, option:ApplicationCommandInteractionDataOption, userId:string): Promise<void> => {
  const projId = option.value;
  if (projId) {
    console.log("projectDelete", projId);
    return Promise.all([
      deleteProject(userId, projId),
      deleteAllProjectsTasks(userId, projId),
      sendTxtLater(`Tu as supprimé ton projet ${projId} et ses taches !\nSavoir terminer un projet est une force!`, interaction.application_id, interaction.token),
    ]).then(() => Promise.resolve());
  } else {
    return sendTxtLater("Donne moi un projet !", interaction.application_id, interaction.token);
  }
};


export const projectFn = async (interaction:Interaction, option:ApplicationCommandInteractionDataOption, userId:string): Promise<void> => {
  if (option.name === "creer" && option.options && option.options.length > 0) {
    return projectAdd(interaction, option.options, userId);
  } if (option.name === "modifier" && option.options && option.options.length > 0) {
    return projectEdit(interaction, option.options, userId);
  } if (option.name === "liste" && option.options && option.options.length > 0 && option.options[0].value) {
    return projectList(interaction, option.options[0].value);
  } if (option.name === "liste") {
    return projectList(interaction, userId, true);
  } if (option.name === "voir" && option.options && option.options.length > 0 && option.options[0].value) {
    return projectView(interaction, option.options[0].value, userId);
  } if (option.name === "supprimer" && option.options && option.options.length > 0) {
    return projectDelete(interaction, option.options[0], userId);
  }
  return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge`, interaction.application_id, interaction.token);
};
