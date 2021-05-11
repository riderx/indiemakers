import axios from "axios";
import * as dotenv from "dotenv";
import {InteractionType} from "discord-interactions";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

dotenv.config();

const url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`;
// Connect im bot to im guild
// https://discord.com/api/oauth2/authorize?client_id=836720524352421919&permissions=8&scope=applications.commands%20bot
export interface applicationCommandOptionChoice {
  "name": string,
  "value": string
}
enum SlashCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP,
  STRING,
  INTEGER,
  BOOLEAN,
  USER,
  CHANNEL,
  ROLE
}

export interface applicationCommandOption {
  name: string,
  description: string,
  type: SlashCommandOptionType,
  required?: boolean,
  choices?: applicationCommandOptionChoice[],
  options?: applicationCommandOption[]
}

export interface ApplicationCommandInteractionData {
  id: string;
  name: string;
  resolved: any;
  options: ApplicationCommandInteractionDataOption[]
}

interface DiscordUser {
  id: string,
  username: string,
  discriminator: string,
  avatar?: string,
  bot?: boolean,
  system?: boolean,
  mfa_enabled: boolean,
  locale?: string,
  verified?: boolean,
  email?: string,
  flags?: number,
  premium_type?: number,
  public_flags?: number,
}

interface GuildMember {
  user?: DiscordUser,
  nick?: string,
  roles: [],
  joined_at: string,
  premium_since?: string,
  deaf: boolean,
  mute: boolean,
  pending?: boolean,
  permissions?: string,
}

export interface Interaction {
  id: string;
  type: InteractionType;
  application_id: string;
  data: ApplicationCommandInteractionData | null;
  guild_id: string;
  channel_id: string;
  member: GuildMember;
  token: string;
  version: number;
}

export interface ApplicationCommandInteractionDataOption {
  name: string,
  type: InteractionType,
  value?: string,
  options?: ApplicationCommandInteractionDataOption[],
}

const choiceGen = (name:string, value:string): applicationCommandOptionChoice => ({name, value});
const optionGen = (name:string, description:string, type: number, required:boolean | undefined = undefined, choices: applicationCommandOptionChoice[] | undefined = undefined, options: applicationCommandOption[] | undefined = undefined): applicationCommandOption => {
  const result:applicationCommandOption = {name, description, type};
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
};
const projetHashtag = optionGen("hashtag", "Le hashtag de ton projet (nom sans espaces)", SlashCommandOptionType.STRING, true);
const taskValues = [
  optionGen("contenue", "Contenue de la tache", SlashCommandOptionType.STRING, true),
  optionGen("status", "Status de la tache", SlashCommandOptionType.STRING, false, [choiceGen("A faire", "todo"), choiceGen("Fait", "done")]),
];
const taskId = optionGen("id", "identifiant unique de la tache", SlashCommandOptionType.STRING, true);
const taskAdd = optionGen("ajouter", "ajouter une tache a un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag, ...taskValues]);
const taskEdit = optionGen("modifier", "Modifier une tache d'un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag, taskId, ...taskValues]);
const taskDelete = optionGen("supprimer", "Supprimer une tache d'un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag, taskId]);
const taskList = optionGen("liste", "Voir toute la liste des taches d'un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag]);

const incomeValues = [
  optionGen("montant", "Montant du revenue", SlashCommandOptionType.STRING, true),
  optionGen("mois", "mois du revenue", SlashCommandOptionType.STRING, true, [
    choiceGen("Janvier", "01"),
    choiceGen("Fevrier", "02"),
    choiceGen("Mars", "03"),
    choiceGen("Avril", "04"),
    choiceGen("Mai", "05"),
    choiceGen("Juin", "06"),
    choiceGen("Juillet", "07"),
    choiceGen("Juillet", "07"),
    choiceGen("Aout", "08"),
    choiceGen("Septembre", "09"),
    choiceGen("Octobre", "10"),
    choiceGen("Novembre", "11"),
    choiceGen("Decembre", "12"),
  ]),
  optionGen("année", "Année du revenue", SlashCommandOptionType.STRING, true),
  optionGen("status", "Status du revenue", SlashCommandOptionType.STRING, true, [choiceGen("Cout", "expense"), choiceGen("Revenue", "income")]),
];
const incomeId = optionGen("id", "identifiant unique du revenue", SlashCommandOptionType.STRING, true);
const incomeAdd = optionGen("ajouter", "ajouter un revenue a un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag, ...incomeValues]);
const incomeEdit = optionGen("modifier", "Modifier un revenue d'un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag, incomeId, ...incomeValues]);
const incomeDelete = optionGen("supprimer", "Supprimer un revenue d'un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag, incomeId]);
const incomeList = optionGen("liste", "Voir toute la liste des revenues d'un projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag]);

const makerId = optionGen("maker", "Le maker désiré", SlashCommandOptionType.USER, true);
const makerIdOptional = optionGen("maker", "Le maker désiré", SlashCommandOptionType.USER);

const projetOptions = [
  projetHashtag,
  optionGen("nom", "Le nom de ton projet", SlashCommandOptionType.STRING),
  optionGen("description", "une description courte de ton projet", SlashCommandOptionType.STRING),
  optionGen("website", "le site de ton projet", SlashCommandOptionType.STRING),
  optionGen("emoji", "l'émoji qui correspond le plus a ton projet", SlashCommandOptionType.STRING),
  optionGen("logo", "l'url vers le logo de ton projet", SlashCommandOptionType.STRING),
  optionGen("categorie", "la categorie de ton projet", SlashCommandOptionType.STRING, undefined, [
    choiceGen("SaaS", "saas"),
    choiceGen("Application", "app"),
    choiceGen("Communauté", "community"),
    choiceGen("Newsletter", "newsletter"),
    choiceGen("Formation", "formation"),
    choiceGen("template", "template"),
    choiceGen("Ecommerce", "ecommerce"),
    choiceGen("Autre", "autre"),
  ]),
];

const makerOptions = [
  optionGen("nom", "Ton nom de Maker", SlashCommandOptionType.STRING),
  optionGen("bio", "Ta bio", SlashCommandOptionType.STRING),
  optionGen("website", "Ton site perso", SlashCommandOptionType.STRING),
  optionGen("emoji", "l'émoji qui te correspond le plus", SlashCommandOptionType.STRING),
  optionGen("photo", "l'url vers ta photo", SlashCommandOptionType.STRING),
  optionGen("makerlog_hook", "la web hook de ton compte makerlog, pour que le bot poste tes taches", SlashCommandOptionType.STRING),
  optionGen("wip_key", "la clé api de ton compte wip.co web hook, pour que le bot poste tes taches", SlashCommandOptionType.STRING),
];

const karma = optionGen("karma", "Echange du karma avec un autre membre du discord", SlashCommandOptionType.SUB_COMMAND_GROUP, undefined, undefined, [
  optionGen("donner", "Donner du karma", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [makerId]),
  optionGen("enlever", "Enlever du karma", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [makerId]),
  optionGen("stats", "Voir le karma d'un maker", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [makerId]),
  optionGen("classement", "Le classement des makers par karma", 1),
]);

const projet = optionGen("projet", "Construit en public tes projets", SlashCommandOptionType.SUB_COMMAND_GROUP, undefined, undefined, [
  optionGen("creer", "Cree ton projet", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, projetOptions),
  optionGen("modifier", "Modifie un de tes projets", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, projetOptions),
  optionGen("supprimer", "Supprime un de tes projets", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag]),
  optionGen("liste", "Voir la liste des projets d'un maker", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [makerIdOptional]),
  optionGen("voir", "Voir un seul projet et ses taches", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [projetHashtag]),
]);

const income = optionGen("revenue", "Gerer les revenues d'un projet", SlashCommandOptionType.SUB_COMMAND_GROUP, undefined, undefined, [
  incomeAdd,
  incomeList,
  incomeEdit,
  incomeDelete,
]);

const tache = optionGen("tache", "Gerer les tache d'un projet", SlashCommandOptionType.SUB_COMMAND_GROUP, undefined, undefined, [
  taskAdd,
  taskList,
  taskEdit,
  taskDelete,
]);

const maker = optionGen("maker", "Gerer ton profil de maker", SlashCommandOptionType.SUB_COMMAND_GROUP, undefined, undefined, [
  optionGen("creer", "Cree ton profil", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, makerOptions),
  optionGen("modifier", "Modifie ton profil", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, makerOptions),
  optionGen("liste", "Voir la liste des makers", 1),
  optionGen("voir", "Voir un seul maker", SlashCommandOptionType.SUB_COMMAND, undefined, undefined, [makerIdOptional]),
]);
if (makerOptions) {
  console.log("yoyo");
}


const jsonData = {
  "name": "im",
  "description": "Le bot qui nous pousse an faire mieux dans nos projets!",
  "options": [
    karma,
    projet,
    tache,
    income,
    maker,
  ],
};

//  For authorization, you can use either your bot token
const headers = {
  "Authorization": `Bot ${process.env.BOT_TOKEN}`,
};

axios.post(url, jsonData, {headers}).then((data) => {
  console.log("result", data.statusText);
}).catch((err) => {
  console.error(err.response);
  console.error(JSON.stringify(err.response.data.errors.options));
  console.error(err.response.statusText);
});
