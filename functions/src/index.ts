import {shortURLPixel} from "./tracker";
import {TwEntities, TwUrl, TwUser, twUserPromise} from "./twitter";
import * as functions from "firebase-functions";
import {sendUserToRevue} from "./newletter";
import * as findHashtags from "find-hashtags";
import * as findMentions from "mentions";
import * as admin from "firebase-admin";
import * as findUrl from "get-urls";

// PixelMeApiToken
const configSecret = functions.config();
// interface Episode {
//   title: string,
//   udi: string,
//   preview: string,
//   image: string,
//   content: string,
// }

interface Person {
    addedBy: string;
    addDate: admin.firestore.Timestamp;
    updateDate: admin.firestore.Timestamp;
    emailSend: boolean | admin.firestore.Timestamp;
    id_str: string;
    name: string;
    login: string;
    description?: string;
    bio: string;
    pic: string;
    votes: number;
    number: number;
}
admin.initializeApp();

const voteIfNotDone = (personId: string, uid: string) => {
  const voteRef = admin.firestore().collection(`/people/${personId}/votes`).doc(uid);
  return voteRef.get()
      .then(async (docSnapshot): Promise<{ error: string } | { done: string }> => {
        if (docSnapshot.exists) {
          return {error: "Already voted"};
        }
        return await voteRef.set({date: Date()})
            .then(() => {
              return {done: "Voted"};
            })
            .catch(() => {
              return {error: "Fail vote"};
            });
      }).catch((err: any) => {
        console.error("Fail vote", err);
        return {error: "Fail vote"};
      });
};

const getPerson = async (id_str: string): Promise<FirebaseFirestore.DocumentReference | null> => {
  const person: FirebaseFirestore.DocumentReference | null = await await admin.firestore()
      .collection("people")
      .where("id_str", "==", id_str)
      .get()
      .then((snapshot) => {
        let result: FirebaseFirestore.DocumentReference | null = null;
        if (snapshot.empty) {
          console.error("No matching person", id_str);
          return null;
        }
        snapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          result = doc.ref;
        });
        return result;
      })
      .catch((err) => {
        console.error("Error getting person", err);
        return null;
      });
  console.log("Person", person);
  return person;
};

const getPersonById = async (id: string): Promise<FirebaseFirestore.DocumentReference> => {
  return admin.firestore()
      .collection("people")
      .doc(id);
};

const findInTwUrls = (url: string, twUrls: TwUrl[]): string => {
  console.log("twUrls", twUrls);
  const found = twUrls.find((twUrl) => {
    if (twUrl.url === url) {
      return twUrl.expanded_url;
    }
    return null;
  });
  return found ? found.expanded_url : url;
};

const transformURLtoTracked = async (text: string, entities: TwEntities | null) => {
  let newDescription = "" + text;
  const links = Array.from(findUrl(text));
  const hashtags = findHashtags(text);
  const mentions = findMentions(text).get();
  for (const link of links) {
    let newHref = link;
    try {
      if (!link.includes("https://imf.to/")) {
        if (entities) {
          const twUrl = findInTwUrls(link, entities.description.urls);
          newHref = await shortURLPixel(twUrl);
        } else {
          newHref = await shortURLPixel(link);
        }
      }
      newDescription = newDescription.split(link).join(newHref);
    } catch (err) {
      console.error("error transform link", link, err);
    }
  }
  for (const hashtag of hashtags) {
    const hHashtag = `#${hashtag}`;
    let newHref = `https://twitter.com/hashtag/${hashtag}`;
    try {
      newHref = await shortURLPixel(newHref);
    } catch (err) {
      console.error("error transform hashtag", hashtag, err);
    }
    newDescription = newDescription.split(hHashtag).join(newHref);
  }
  for (const mention of mentions) {
    const mMention = mention.substring(1);
    let newHref = `https://twitter.com/${mMention}`;
    try {
      newHref = await shortURLPixel(newHref);
    } catch (err) {
      console.error("error transform mention", mention, err);
    }
    newDescription = newDescription.split(mention).join(newHref);
  }
  return newDescription;
};

export const getMakers = functions.https.onRequest(async (req, res) => {
  if (req.get("x-verceladmin-apikey") !== configSecret.verceladmin.apikey) {
    res.json({error: "unAuthorise"});
    return;
  }
  try {
    const resultList = await admin.firestore()
        .collection("people")
        .orderBy("votes", "desc")
        .orderBy("addDate", "asc")
        .get()
        .then((querySnapshot) => {
          return querySnapshot.docs.map((doc) => Object.assign(doc.data(), {id: doc.id}));
        });
    res.json(resultList);
  } catch (err) {
    console.error("err", err);
    res.json([]);
  }
});

export const addEp = functions.https.onRequest(async (req, res) => {
  if (req.get("x-verceladmin-apikey") !== configSecret.verceladmin.apikey) {
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

export const updateTwiterUser = functions.pubsub.schedule("0 0 * * *").onRun(async (context) => {
  const users = await admin.firestore()
      .collection("people")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => Object.assign(doc.data(), {id: doc.id}));
      });
  users.forEach(async (user) => {
    await admin.firestore()
        .collection("/people")
        .doc(user.id)
        .update({updateDate: admin.firestore.Timestamp.now()}).then(() => {
          console.log("updateDate updated");
        }).catch((error: any) => {
          console.error("Error update person", error);
        });
  });
  return null;
});

export const addTwiterUser = functions.https.onCall(async (data, context) => {
  const name = data.name;
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
              }).catch((err) => {
                console.error("Cannot create", err);
                return {error: "Cannot create"};
              });
        } else {
          return await voteIfNotDone(exist.id, uid);
        }
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

export const calcVotesByPerson = functions.firestore
    .document("/people/{personId}/votes/{voteId}")
    .onCreate(async (snapshot, context) => {
      const vote = snapshot.data();
      if (vote) {
        const personId = context.params.personId;
        const id_str = vote.id_str;
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
        } else {
          console.error("No votes");
        }
      }
      return snapshot;
    });

export const onCreatUser = functions.firestore
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

export const onUpdatePeople = functions.firestore
    .document("/people/{personId}")
    .onUpdate(async (snapshot, context) => {
      const person: Person | undefined = <Person>snapshot.after.data();
      const personId = context.params.personId;
      if (person && person.bio) {
        const twUser: TwUser | null = await twUserPromise(person.login);
        const name = twUser.name;
        const bio = await transformURLtoTracked(person.bio, twUser ? twUser.entities : null);
        const pic = twUser ? twUser.profile_image_url_https.replace("_normal", "") : person.pic;
        if (bio !== person.bio || pic !== person.pic || name !== person.name) {
          await admin.firestore()
              .collection("/people")
              .doc(personId)
              .update({bio, pic, name}).then(() => {
                console.log("bio updated", personId);
              }).catch((error: any) => {
                console.error("Error update person", error);
              });
        }
      }
      if (!person.number) {
        const update = {emailSend: true, number: Number.MAX_SAFE_INTEGER};
        await admin.firestore()
            .collection("/people")
            .doc(personId)
            .update(update).then(() => {
              console.log("emailSend updated");
            }).catch((error: any) => {
              console.error("Error update emailSend", error);
            });
      }
      return snapshot;
    });
