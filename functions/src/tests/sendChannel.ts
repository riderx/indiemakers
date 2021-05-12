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
const userCard = embed(name, bio, "fa", fields, undefined, undefined, "2021-05-12T18:57:34.605Z", thumb);
// const userCard2 = embed(name, bio, '16777215', fields, undefined, undefined);
// openChannel('309008240274964480').then((channel:any) => senChannel(channel.id, '', userCard2));
openChannel("309008240274964480").then((channel:any) => senChannel(channel.id, "Voici tes infos !\n", userCard));
