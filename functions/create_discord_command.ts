import axios from "axios";
import * as dotenv from "dotenv";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

dotenv.config();

const url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`
// Connect im bot to im guild
// https://discord.com/api/oauth2/authorize?client_id=836720524352421919&permissions=8&scope=applications.commands%20bot
interface applicationCommandOptionChoice {
  "name": string,
  "value": string
}
interface applicationCommandOption {
  "name": string,
  "description": string,
  "type": number,
  "required"?: boolean,
  "choices"?: applicationCommandOptionChoice[],
  "options"?: applicationCommandOption[]
}
const choiceGen = (name:string, value:string): applicationCommandOptionChoice => ({name, value});
const optionGen = (name:string, description:string, type: number, required:boolean | undefined = undefined, choices: applicationCommandOptionChoice[] | undefined = undefined, options: applicationCommandOption[] | undefined = undefined): applicationCommandOption => {
  let result:applicationCommandOption = {name, description, type};
  if (required !== undefined) {
    result.required = required;
  }
  if (choices !== undefined) {
    result.choices = choices;
  }
  if (options !== undefined) {
    result.options = options;
  }
  return result;
}
const projetHashtag = optionGen("hashtag", "Le hashtag de ton projet (nom sans espaces)", 3, true);
const taskValues = [
  optionGen("contenue", "Contenue de la tache", 3, true),
  optionGen("status", "Status de la tache", 3, false, [choiceGen("A faire", "todo"), choiceGen("Fait", "done")])
];
const taskId = optionGen("id", "identifiant unique de la tache", 3, true);
const taskAdd = optionGen("ajouter", "ajouter une tache a un projet", 1, undefined, undefined, [projetHashtag, ...taskValues]);
const taskEdit =  optionGen("modifier", "Modifier une tache d'un projet", 1, undefined, undefined, [projetHashtag, taskId,...taskValues]);
const taskDelete =  optionGen("supprimer", "Supprimer une tache d'un projet", 1, undefined, undefined, [projetHashtag, taskId]);
const taskList =  optionGen("liste", "Voir toute la liste des taches d'un projet", 1, undefined, undefined, [projetHashtag]);

const incomeValues = [
  optionGen("montant", "Montant du revenue", 3, true),
  optionGen("status", "Status du revenue", 3, false, [choiceGen("Cout", "expense"), choiceGen("Revenue", "income")])
];
const incomeId = optionGen("id", "identifiant unique du revenue", 3, true);
const incomeAdd = optionGen("ajouter", "ajouter un revenue a un projet", 1, undefined, undefined, [projetHashtag, ...incomeValues]);
const incomeEdit =  optionGen("modifier", "Modifier un revenue d'un projet", 1, undefined, undefined, [projetHashtag, incomeId,...incomeValues]);
const incomeDelete =  optionGen("supprimer", "Supprimer un revenue d'un projet", 1, undefined, undefined, [projetHashtag, incomeId]);
const incomeList =  optionGen("liste", "Voir toute la liste des revenues d'un projet", 1, undefined, undefined, [projetHashtag]);

const makerId =  optionGen("maker", "Le maker désiré", 6, true);
const makerIdOptional = optionGen("maker", "Le maker désiré", 6);

const projetOptions = [
  projetHashtag,
  optionGen("nom", "Le nom de ton projet", 3),
  optionGen("description", "une description courte de ton projet", 3),
  optionGen("website", "le site de ton projet", 3),
  optionGen("emoji", "l'émoji qui correspond le plus a ton projet", 3),
  optionGen("logo", "l'url vers le logo de ton projet", 3),
  optionGen("categories", "la categorie de ton projet", 3, undefined, [
    choiceGen("SaaS", "saas"),
    choiceGen("Application", "app"),
    choiceGen("Communauté", "community"),
    choiceGen("Newsletter", "newsletter"),
    choiceGen("Formation", "formation"),
    choiceGen("template", "template"),
    choiceGen("Ecommerce", "ecommerce"),
    choiceGen("Autre", "autre"),
  ]),
]

const karma = optionGen("karma", "Echange du karma avec un autre membre du discord", 2, undefined, undefined, [
  optionGen("donner", "Donner du karma", 1, undefined, undefined, [makerId]),
  optionGen("enlever", "Enlever du karma", 1, undefined, undefined, [makerId]),
  optionGen("stats", "Voir le karma d'un maker", 1, undefined, undefined, [makerId]),
  optionGen("classement", "Le classement des makers par karma", 1),
]);

const projet = optionGen("projet", "Construit en public tes projets", 2, undefined, undefined, [
  optionGen("creer", "Cree ton projet", 1, undefined, undefined, projetOptions),
  optionGen("modifier", "Modifie un de tes projets", 1, undefined, undefined, projetOptions),
  optionGen("supprimer", "Supprime un de tes projets", 1, undefined, undefined, [projetHashtag]),
  optionGen("liste", "Voir la liste des projets d'un maker", 1, undefined, undefined, [makerIdOptional]),
  optionGen("voir", "Voir un seul projet et ses taches", 1, undefined, undefined, [projetHashtag]),
]);

const income = optionGen("revenue", "Gere les revenues d'un projet", 2, undefined, undefined, [
  incomeAdd,
  incomeList,
  incomeEdit,
  incomeDelete,
]);

const tache = optionGen("tache", "Gere les tache d'un projet", 2, undefined, undefined, [
  taskAdd,
  taskList,
  taskEdit,
  taskDelete,
]);

const jsonData = {
    "name": "im",
    "description": "Le bot qui nous pousse an faire mieux dans nos projets!",
    "options": [
      karma,
      projet,
      tache,
      income
    ]
}

//  For authorization, you can use either your bot token
const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`
}

axios.post(url, jsonData, {headers}).then((data) => {
  console.log('result', data.statusText);
}).catch((err) => {
  console.error(err.response);
  console.error(JSON.stringify(err.response.data.errors.options));
  console.error(err.response.statusText);
});
