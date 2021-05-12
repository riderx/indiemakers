import * as dotenv from "dotenv";

dotenv.config();
import {embed, field, image, openChannel, senChannel} from "../discord/bot/utils";

const fields = [
  field("🔥 Flammes", String(2)),
  field("🕉 Karma", String(10)),
  field("🌱 Projets", String(1)),
  field("💗 Taches", String(3)),
];
fields.push(field("Makerlog", String("https://indiemakers.fr"), false));
fields.push(field("WIP", String("htjtjktjtjktjk"), false));
const name = "👨‍🌾 Martin donadieu";
const bio = "Un jours je serais grand !";
const thumb = image("https://indiemakers.fr/_nuxt/img/cover-im@0.5x.da57ed6.png");
const userCard = embed(name, bio, "#fff", fields, undefined, undefined, "2011-10-05T14:48:00.000Z", undefined, thumb);
openChannel("309008240274964480").then((channel:any) => senChannel(channel.id, "Voici tes infos !\n", userCard));
