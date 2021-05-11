import {firestore} from "firebase-admin";
import dayjs from "dayjs";
import {sendTxtLater} from "./utils";
import {Interaction, ApplicationCommandInteractionDataOption} from "./create_command";

interface income {
  id?: string,
  ammount: number,
  status: "expense" | "income",
  date: string,
}
const createProjectIncome = async (userId: string, projectId: string, income: income) => {
  return firestore().collection(`discord/${userId}/projects/${projectId}/incomes`).add({...income, createdAt: dayjs().toISOString()});
};

const deleteProjectIncome = async (userId: string, projectId: string, incomeId:string) => {
  return firestore().collection(`discord/${userId}/projects/${projectId}/incomes`).doc(incomeId).delete();
};

const updateProjectIncome = async (userId: string, projectId: string, incomeId:string, income: income) => {
  return firestore().collection(`discord/${userId}/projects/${projectId}/incomes`).doc(incomeId).update({...income, updatesAt: dayjs().toISOString()});
};

const updateProjecttotalIncome = async (userId: string, projectId: string, totalIncome: number) => {
  const projDoc = await firestore().collection(`discord/${userId}/projects/`).doc(projectId).get();
  if (!projDoc.exists || !projDoc.data) {
    console.error(`Cannot add total to userId: ${userId}, projectId: ${projectId}, totalIncome: ${totalIncome}`);
  }
  return projDoc.ref.update({totalIncome, updateAt: dayjs().toISOString()});
};

const getAllProjectsIncomes = async (userId: string, projectId: string) => {
  try {
    const documents = await firestore().collection(`discord/${userId}/projects/${projectId}/incomes`).get();
    const incomes: income[] = [];
    documents.docs
        .map((doc) => {
          const data = (doc.data() as income);
          if (data !== undefined) {
            incomes.push({id: doc.id, ...data});
          }
        });
    const total = incomes.reduce((tt, current) => {
      return current.status === "expense" ? tt - Number(current.ammount) : tt + Number(current.ammount);
    }, 0);
    return {incomes, total};
  } catch (err) {
    console.error("err", err);
    return {incomes: [], total: 0};
  }
};

const incomeAdd = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], senderId:string) => {
  let projectId = "";
  const newIncome: any = {};
  options.forEach((element: any) => {
    if (element.name === "hashtag") {
      projectId = element.value;
    } else if (element.name === "montant") {
      newIncome["ammount"] = element.value;
    } else if (element.name === "status") {
      newIncome["status"] = element.value;
    }
  });
  const curIncomes = await getAllProjectsIncomes(senderId, projectId);
  return Promise.all([
    createProjectIncome(senderId, projectId, newIncome),
    updateProjecttotalIncome(senderId, projectId, curIncomes.total + 1),
    sendTxtLater(`Le revenue :\n${newIncome["status"]}: ${newIncome["ammount"]}\nA été ajouté au projet #${projectId}, 🎉!`, interaction.application_id, interaction.token),
  ]).then(() => Promise.resolve());
};

const incomeEdit = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], senderId:string) => {
  let projectId = "";
  let incomeId = "";
  const update: any = {};
  options.forEach((element: any) => {
    if (element.name === "hashtag") {
      projectId = element.value;
    } else if (element.name === "montant") {
      update["ammount"] = element.value;
    } else if (element.name === "status") {
      update["status"] = element.value;
    } else if (element.name === "date") {
      update["date"] = element.value;
    } else if (element.name === "id") {
      incomeId = element.value;
    }
  });
  return Promise.all([
    updateProjectIncome(senderId, projectId, incomeId, update),
    sendTxtLater(`Le revenue ${incomeId} a été mise a jours dans le projet #${projectId}, 🎉!`, interaction.application_id, interaction.token),
  ]).then(() => Promise.resolve());
};

const incomesView = async (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId:string) => {
  const projectId = option.value;
  if (projectId) {
    const allTaks = await getAllProjectsIncomes(senderId, projectId);
    let incomeInfos = `Tu a fait ${allTaks.total} € sur ce projet, BRAVO 🎉!\n\nVoici La liste des revenus:\n`;
    allTaks.incomes.forEach((element: any) => {
      incomeInfos += `${element.text} . Crée le ${dayjs(element.createdAt).format("DD/MM/YYYY")}\n`;
    });
    return sendTxtLater(incomeInfos, interaction.application_id, interaction.token);
  } else {
    return sendTxtLater(`Je ne trouve pas le projet ${projectId} 😅`, interaction.application_id, interaction.token);
  }
};

const incomesDelete = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], senderId:string) => {
  let projectId = "";
  let incomeId = "";
  options.forEach((element: any) => {
    if (element.name === "hashtag") {
      projectId = element.value;
    } else if (element.name === "id") {
      incomeId = element.value;
    }
  });
  const curIncomes = await getAllProjectsIncomes(senderId, projectId);
  return Promise.all([
    deleteProjectIncome(senderId, projectId, incomeId),
    updateProjecttotalIncome(senderId, projectId, curIncomes.total),
    sendTxtLater(`Tu as supprimé le revenue ${incomeId} !`, interaction.application_id, interaction.token),
  ]).then(() => Promise.resolve());
};

export const incomeFn = async (interaction:any, option: ApplicationCommandInteractionDataOption, senderId:string): Promise<void> => {
  if (option.name === "ajouter" && option.options && option.options.length > 0) {
    return incomeAdd(interaction, option.options, senderId);
  } if (option.name === "liste" && option.options && option.options.length > 0) {
    return incomesView(interaction, option.options[0], senderId);
  } if (option.name === "modifier" && option.options && option.options.length > 0) {
    return incomeEdit(interaction, option.options, senderId);
  } if (option.name === "supprimer" && option.options && option.options.length > 0) {
    return incomesDelete(interaction, option.options, senderId);
  }
};
