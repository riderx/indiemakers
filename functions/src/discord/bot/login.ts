import {auth} from "firebase-admin";
import {Interaction} from "../config";
import {userExists} from "./../../users";
import {getUsersById} from "./user";
import {embed, image, openChannel, senChannel, sendTxtLater} from "./utils";

export const login = async (userId: string): Promise<string|null> => {
  try {
    const exists = await userExists(userId);
    if (exists) {
      const authToken = await auth().createCustomToken(userId);
      return authToken;
    }
    await auth().createUser({uid: userId});
    const authToken = await auth().createCustomToken(userId);
    return authToken;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const loginFn = async (interaction: Interaction, userId:string): Promise<void> => {
  const user = await getUsersById(userId);
  let loginImage = image("https://github.com/riderx/indiemakers/blob/main/assets/images/cover-im_fav@0.5x.png?raw=true");
  if (user && user.avatarUrl) {
    loginImage = image(user.avatarUrl);
  }
  if (!user?.email) {
    return sendTxtLater("Tu dois d'abord ajouter ton email a ton profil", undefined, interaction.application_id, interaction.token);
  }
  return Promise.all([
    sendTxtLater("Je t'ai envoyé ton lien de login en privé 🤫", undefined, interaction.application_id, interaction.token),
    login(userId)
        .then((loginToken) => openChannel(userId)
            .then((channel) => senChannel(channel.id, "", embed(undefined, `[Voici ton lien de login](https://indiemakers.fr/login?token=${loginToken})`, "4b279b", undefined, undefined, undefined, undefined, undefined, loginImage)))
        )]).then(() => Promise.resolve());
};
