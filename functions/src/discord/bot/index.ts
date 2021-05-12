import {loginFn} from "./login";
import {userFn} from "./user";
import {incomeFn} from "./income";
import {projectFn} from "./project";
import {sendTxt, sendTxtLater, sendTxtLoading} from "./utils";
import {karmaFn} from "./karma";
import {taskFn} from "./tasks";
import {InteractionResponseType, InteractionType, verifyKey} from "discord-interactions";
import {Request, Response} from "express";
import {ApplicationCommandInteractionDataOption, Interaction} from "../config";

const CLIENT_PUBLIC_KEY = "76a1cf12caec747f872ee6ea064269d4acd2538b2f1e26f89853f93c32d045db";

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
    if (option.name === "login") {
      await sendTxtLoading(res);
      return loginFn(interaction, senderId);
    }
    if (option.name === "doc") {
      await sendTxt(res, "Voici la doc pou m'utiliser ! https://indiemakers.gitbook.io/bot/");
      return Promise.resolve();
    }
    await sendTxt(res, `La Commande ${option.name} n'est pas pris en charge`);
    return Promise.resolve();
  } catch (err) {
    console.error("im", err);
    return sendTxtLater(`La Commande ${option.name} a échoué`, [], interaction.application_id, interaction.token);
  }
};

const discordInteraction = async (req:Request, res:Response): Promise<void> => {
  // Verify the request
  const signature = req.get("X-Signature-Ed25519") || "";
  const timestamp = req.get("X-Signature-Timestamp") || "";
  const isValidRequest = await verifyKey((req as any).rawBody, signature, timestamp, CLIENT_PUBLIC_KEY);
  if (!isValidRequest) {
    return res.status(401).end("Bad request signature");
  }

  const interaction: Interaction = req.body;
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

