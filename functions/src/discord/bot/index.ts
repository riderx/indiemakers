import {projetc_fn} from "./project";
import {sendTxt, sendTxtLater, sendTxtLoading} from "./utils";
import {karma_fn} from "./karma";
import {task_fn} from "./tasks";
import {InteractionResponseType, InteractionType, verifyKey} from "discord-interactions";
import {Request, Response} from "express";

const CLIENT_PUBLIC_KEY = "76a1cf12caec747f872ee6ea064269d4acd2538b2f1e26f89853f93c32d045db";

const im = async (res:Response, interaction: any, option:any, senderId:string) => {
  try {
    if (option.name === "karma" && option.options.length > 0) {
      await sendTxtLoading(res);
      return karma_fn(res, interaction, option.options[0], senderId);
    }
    if (option.name === "projet" && option.options.length > 0) {
      await sendTxtLoading(res);
      return projetc_fn(res, interaction, option.options[0], senderId);
    }
    if (option.name === "tache" && option.options.length > 0) {
      await sendTxtLoading(res);
      return task_fn(res, interaction, option.options[0], senderId);
    }
    return sendTxt(res, `La Commande ${option.name} n'est pas pris en charge`);
  } catch (err) {
    console.error(err);
    return sendTxtLater(`La Commande ${option.name} a échoué`, interaction.application_id, interaction.token);
  }
};

const discordInteraction = async (req:Request, res:Response) => {
  // Verify the request
  const signature = req.get("X-Signature-Ed25519") || "";
  const timestamp = req.get("X-Signature-Timestamp") || "";
  const isValidRequest = await verifyKey((req as any).rawBody, signature, timestamp, CLIENT_PUBLIC_KEY);
  if (!isValidRequest) {
    return res.status(401).end("Bad request signature");
  }

  const interaction = req.body;
  if (interaction && interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === "im" && interaction.data.options.length > 0) {
      return im(res, interaction, interaction.data.options[0], interaction.member.user.id);
    }
    return sendTxt(res, `La Commande ${interaction.data.name} n'est pas pris en charge`);
  }
  return res.send({
    type: InteractionResponseType.PONG,
  });
};

export default discordInteraction;

