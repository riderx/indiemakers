import {userFn} from "./user";
import {incomeFn} from "./income";
import {projectFn} from "./project";
import {sendTxt, sendTxtLater, sendTxtLoading} from "./utils";
import {karmaFn} from "./karma";
import {taskFn} from "./tasks";
import {InteractionResponseType, InteractionType} from "discord-interactions";
import {Response} from "express";
import {ApplicationCommandInteractionDataOption, Interaction} from "../create_command";

const im = async (res:Response, interaction: Interaction, option:ApplicationCommandInteractionDataOption, senderId:string): Promise<void> => {
  try {
    if (option.name === "karma" && option.options && option.options.length > 0) {
      await sendTxtLoading(res);
      return karmaFn(interaction, option.options[0], senderId);
    }
    if (option.name === "projet" && option.options && option.options.length > 0) {
      await sendTxtLoading(res);
      return projectFn(interaction, option.options[0], senderId);
    }
    if (option.name === "tache" && option.options && option.options.length > 0) {
      await sendTxtLoading(res);
      return taskFn(interaction, option.options[0], senderId);
    }
    if (option.name === "revenue" && option.options && option.options.length > 0) {
      await sendTxtLoading(res);
      return incomeFn(interaction, option.options[0], senderId);
    }
    if (option.name === "maker" && option.options && option.options.length > 0) {
      await sendTxtLoading(res);
      return userFn(interaction, option.options[0], senderId);
    }
    if (option.name === "doc") {
      await sendTxt(res, `Voici la doc pou m'utiliser ! https://indiemakers.gitbook.io/bot/`);
      return Promise.resolve();
    }
    await sendTxt(res, `La Commande ${option.name} n'est pas pris en charge`);
    return Promise.resolve();
  } catch (err) {
    console.error("im", err);
    return sendTxtLater(`La Commande ${option.name} a échoué`,[], interaction.application_id, interaction.token);
  }
};

const discordInteraction = async (interaction: Interaction, res:Response): Promise<void> => {
  if (interaction && interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data) {
    if (interaction.data.name === "im" && interaction.data.options && interaction.data.options.length > 0 && interaction.member.user) {
      return im(res, interaction, interaction.data.options[0], interaction.member.user.id);
    }
    await sendTxt(res, `La Commande ${interaction.data.name} n'est pas pris en charge`);
    return Promise.resolve();
  }
  await res.send({
    type: InteractionResponseType.PONG,
  });
  return Promise.resolve();
};

export default discordInteraction;

