import {config, https, pubsub, firestore, runWith, RuntimeOptions} from "firebase-functions";
import admin, {initializeApp} from "firebase-admin";
import {getPerson, getPersonById, voteIfNotDone} from "./users";
import {
  TwUser, twUserPromise,
} from "./twitter";
import {sendUserToRevue} from "./newletter";
import discordInteraction from "../../services/discord/bot";
import {Person} from "./types";
import {updateRevenueAllProject} from "../../services/discord/bot/stripe";
import dayjs from "dayjs";
import {transformURLtoTracked} from "./tracker";
import {usersViewStreak} from "../../services/discord/bot/user";
import {sendChannel} from "../../services/discord/bot/utils";
import {verifyKey} from "discord-interactions";

initializeApp();

export const getMakers = https.onRequest(async (req, res) => {
  if (req.get("x-verceladmin-apikey") !== config().verceladmin.apikey) {
    res.json({error: "unAuthorise"});
    return;
  }
  try {
    const resultList = await admin.firestore()
        .collection("people")
        .orderBy("votes", "desc")
        .orderBy("addDate", "asc")
        .get()
        .then((querySnapshot) => querySnapshot.docs.map((doc) => Object.assign(doc.data(), {id: doc.id})));
    res.json(resultList);
  } catch (err) {
    console.error("err", err);
    res.json([]);
  }
});

export const addEp = https.onRequest(async (req, res) => {
  if (req.get("x-verceladmin-apikey") !== config().verceladmin.apikey) {
    res.json({error: "unAuthorise"});
    return;
  }
  try {
    await admin.firestore()
        .collection("episodes")
        .doc(req.body.udi)
        .update({udi: req.body.udi});
    res.json({error: "already done"});
  } catch {
    try {
      await admin.firestore()
          .collection("episodes")
          .doc(req.body.udi)
          .set(req.body);
      res.json({status: "done"});
    } catch (err) {
      res.json({error: err});
    }
  }
});

export const updateTwiterUser = pubsub.schedule("0 0 * * *").onRun(async () => {
  const users = await admin.firestore()
      .collection("people")
      .get()
      .then((querySnapshot) => querySnapshot.docs.map((doc) => Object.assign(doc.data(), {id: doc.id})));
  users.forEach(async (user) => {
    await admin.firestore()
        .collection("/people")
        .doc(user.id)
        .update({updateDate: admin.firestore.Timestamp.now()})
        .then(() => {
          console.log("updateDate updated");
        })
        .catch((error) => {
          console.error("Error update person", error);
        });
  });
  return null;
});

export const addTwiterUser = https.onCall(async (data, context) => {
  const {name} = data;
  const uid = context.auth ? context.auth.uid : null;
  if (uid) {
    try {
      const twUser = await twUserPromise(name);
      if (twUser) {
        console.log("user", twUser);
        const newPerson: Person = {
          addedBy: uid,
          updateDate: admin.firestore.Timestamp.now(),
          addDate: admin.firestore.Timestamp.now(),
          emailSend: true,
          id_str: twUser.id_str,
          name: twUser.name,
          login: twUser.screen_name,
          bio: await transformURLtoTracked(twUser.description || "", twUser.entities),
          pic: twUser.profile_image_url_https.replace("_normal", ""),
          votes: 1,
          number: Number.MAX_SAFE_INTEGER,
        };
        let exist: FirebaseFirestore.DocumentReference | null = null;
        try {
          exist = await getPerson(newPerson.id_str);
        } catch (err) {
          console.error("Not exist", newPerson.id_str);
        }
        if (!exist) {
          return await admin.firestore()
              .collection("people")
              .add(newPerson)
              .then(async (person) => {
                await voteIfNotDone(person.id, uid);
                console.log("New account added");
                return {done: "New account added"};
              })
              .catch((err) => {
                console.error("Cannot create", err);
                return {error: "Cannot create"};
              });
        }
        return await voteIfNotDone(exist.id, uid);
      }
      return {error: "Not found on api twitter"};
    } catch (err) {
      console.error("Cannot find user", err);
      return {error: err};
    }
  }
  console.error("Not loggin");
  return {error: "Not loggin"};
});

export const calcVotesByPerson = firestore
    .document("/people/{personId}/votes/{voteId}")
    .onCreate(async (snapshot, context) => {
      const vote = snapshot.data();
      if (vote) {
        const {personId} = context.params;
        const {id_str} = vote;
        const person = await getPersonById(personId);
        const snap = await admin.firestore()
            .collection(`/people/${personId}/votes`)
            .get();
        const votesTotal = snap.size;
        if (person && snap && votesTotal) {
          return person.update({votes: votesTotal}).then(() => {
            console.log("Updates votes", id_str, votesTotal);
          }).catch((error) => {
            console.error("Error", error);
          });
        }
        console.error("No votes");
      }
      return snapshot;
    });

export const onCreatUser = firestore
    .document("/users/{uid}")
    .onCreate(async (snapshot) => {
      const user = snapshot.data();
      if (user && user.email && user.email !== "") {
        await sendUserToRevue(user.email, user.first_name);
      }
    });

// export const onCreatEpisode = functions.firestore
//   .document('/episodes/{uid}')
//   .onCreate(async (snapshot) => {
//     const ep = <Episode>snapshot.data()
//     if (ep && ep.title && ep.title !== '') {
//       initEmail(configSecret.sendgrid.apikey)
//       await sendEmailEp(ep)
//     }
//   })

export const onUpdatePeople = firestore
    .document("/people/{personId}")
    .onUpdate(async (snapshot, context) => {
      const person: Person | undefined = <Person>snapshot.after.data();
      const {personId} = context.params;
      if (person && person.bio) {
        const twUser: TwUser | null = await twUserPromise(person.login);
        const {name} = twUser;
        const bio = await transformURLtoTracked(person.bio, twUser ? twUser.entities : null);
        const pic = twUser ? twUser.profile_image_url_https.replace("_normal", "") : person.pic;
        if (bio !== person.bio || pic !== person.pic || name !== person.name) {
          await admin.firestore()
              .collection("/people")
              .doc(personId)
              .update({bio, pic, name})
              .then(() => {
                console.log("bio updated", personId);
              })
              .catch((error) => {
                console.error("Error update person", error);
              });
        }
      }
      if (!person.number) {
        const update = {emailSend: true, number: Number.MAX_SAFE_INTEGER};
        await admin.firestore()
            .collection("/people")
            .doc(personId)
            .update(update)
            .then(() => {
              console.log("emailSend updated");
            })
            .catch((error) => {
              console.error("Error update emailSend", error);
            });
      }
      return snapshot;
    });

const runtimeOpts: RuntimeOptions = {
  memory: "512MB",
};

function getRawBody(req: https.Request): Promise<string> {
  return new Promise((resolve) => {
    const bodyChunks: Buffer[] = [];
    req.on("end", () => {
      const rawBody = Buffer.concat(bodyChunks).toString("utf8");
      resolve(rawBody);
    });
    req.on("data", (chunk) => bodyChunks.push(chunk));
    return;
  });
}

export const discordBot = runWith(runtimeOpts).https.onRequest(async (req, res) => {
  const signature = req.get("X-Signature-Ed25519") || "";
  const timestamp = req.get("X-Signature-Timestamp") || "";
  const rawBody = await getRawBody(res as any);
  const resConfig = await admin.firestore().collection("bot").doc("config").get();
  const data = resConfig.data();
  if (!data || !data.CLIENT_PUBLIC_KEY) {
    return res.status(401).end("Bad request");
  }
  const isValidRequest = await verifyKey(rawBody, signature, timestamp, data.CLIENT_PUBLIC_KEY);
  if (!isValidRequest) {
    return res.status(401).end("Bad request signature");
  }
  return discordInteraction(req.body, res);
});

export const scheduledBotBIP = pubsub.schedule("0 18 * * *")
    .timeZone("Europe/Paris")
    .onRun(async () => {
      console.log("This will be run every day at 18:00 AM Paris!");
      const res = await admin.firestore().collection("bot").doc("config").get();
      const data = res.data();
      if (data) {
        await sendChannel(data.channel_bip,
            "Hey Makers, il est temps de noter vos taches dans vos projets et d'aller chill !");
      }
      return null;
    });

export const scheduledBotBIPMorning = pubsub.schedule("0 9 * * *")
    .timeZone("Europe/Paris")
    .onRun(async () => {
      console.log("This will be run every day at 9:00 AM Paris!");
      const res = await admin.firestore().collection("bot").doc("config").get();
      const data = res.data();
      if (data) {
        const usersInfoCards = await usersViewStreak();
        await sendChannel(data.channel_bip,
            "Hey Makers, Encore une belle journée pour shipper !\n\nContinuez comme ça !");
        for (let index = 0; index < usersInfoCards.length && index < data.ladderLimit; index++) {
          const card = usersInfoCards[index];
          await sendChannel(data.channel_bip, "", card);
        }
        if (dayjs().day() === 1) {
          await sendChannel(data.channel_general,
              "Hey Makers, Faites moi un petit récap de votre semaine 1 Bon point / 1 point relou, minimum 💪!"),
          await updateRevenueAllProject();
        }
      }
      return null;
    });
