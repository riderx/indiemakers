import { sendWithTemplate } from './email';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TwitterApiToken } from './twitter_api';
import { moment } from './moment';
const Twitter = require('twitter');

const client = new Twitter(TwitterApiToken);

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();

const voteIfNotDone = (personId: string, uid: string) => {
    const voteRef = admin.firestore().collection(`/people/${personId}/votes`).doc(uid)
    return voteRef.get()
        .then(async (docSnapshot): Promise<{ error: string } | { done: string }> => {
            if (docSnapshot.exists) {
                return { error: 'Already voted' };
            }
            return await voteRef.set({ date: Date() })
                .then(() => {
                    return { done: "Voted" };
                })
                .catch(() => {
                    return { error: "Fail vote" };
                });
        }).catch((err: any) => {
            console.error('Fail vote', err);
            return { error: "Fail vote" };
        });
}

const getPerson = async (id_str: string): Promise<FirebaseFirestore.DocumentReference | null> => {
    const person: FirebaseFirestore.DocumentReference | null = await await admin.firestore()
        .collection('people')
        .where("id_str", "==", id_str)
        .get()
        .then(snapshot => {
            let result: FirebaseFirestore.DocumentReference | null = null;
            if (snapshot.empty) {
                console.error('No matching person', id_str);
                return null;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                result = doc.ref;
            });
            return result;
        })
        .catch(err => {
            console.error('Error getting person', err);
            return null;
        });
    console.log('Person', person);
    return person;
}

const getPersonById = async (id: string): Promise<FirebaseFirestore.DocumentReference> => {
    return admin.firestore()
        .collection(`people`)
        .doc(id);
}

const twUserPromise = (screen_name: string): Promise<{
    id_str: string,
    name: string,
    screen_name: string,
    description: string,
    profile_image_url_https: string
}> => {
    return new Promise((resolve, reject) => {
        const params = { screen_name };
        client.get('users/show', params, async (error: any, user: any, response: any) => {
            if (!error && user) {
                console.log('User', user, 'response', response);
                resolve(user);
            } else {
                console.error('Cannot find user', error, response);
                reject(error);
            }
        });
    });
}

export const addTwiterUser = functions.https.onCall(async (data, context) => {
    const name = data.name;
    const uid = context.auth ? context.auth.uid : null;
    if (uid) {
        try {
            const twUser = await twUserPromise(name);
            if (twUser) {
                console.log('user', twUser);
                const newPerson = {
                    addedBy: uid,
                    addDate: new Date(),
                    emailSend: true,
                    id_str: twUser.id_str,
                    name: twUser.name,
                    login: twUser.screen_name,
                    bio: twUser.description,
                    pic: twUser.profile_image_url_https.replace('_normal', ''),
                    votes: 1
                }
                let exist = null;
                try {
                    exist = await getPerson(newPerson.id_str);
                } catch (err) {
                    console.error('Not exist', newPerson.id_str);
                }
                if (!exist) {
                    return await admin.firestore()
                        .collection('people')
                        .add(newPerson)
                        .then(async (person) => {
                            await voteIfNotDone(person.id, uid);
                            console.log('New account added');
                            return { done: 'New account added' };
                        }).catch((err) => {
                            console.error('Cannot create', err);
                            return { error: 'Cannot create' };
                        })
                } else {
                    return await voteIfNotDone(exist.id, uid);
                }
            }
            return { error: 'Not found on api twitter' };
        } catch (err) {
            console.error('Cannot find user', err);
            return { error: err };
        }
    }
    console.error('Not loggin');
    return { error: 'Not loggin' };
});

export const calcVotesByPerson = functions.firestore
    .document('/people/{personId}/votes/{voteId}')
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
                return person.update({ votes: votesTotal }).then(() => {
                    console.log('Updates votes', id_str, votesTotal);
                }).catch((error) => {
                    console.error('Error', error);
                });
            } else {
                console.error('No votes');
            }
        }
        return snapshot;
    });

const sendEmail = (user: any, maker: any, makerId: string, subject: string, template: string, previewText: string) => {
    return new Promise((resolve, reject) => {
        sendWithTemplate('indiemakerfr@gmail.com', user.email, subject, 'text', template, {
            LINKEPISODE: `https://indiemaker.fr/%23/episode/${makerId}`,
            MC_PREVIEW_TEXT: previewText,
            NAME: user.displayName || 'Elon Musk',
            SUBJECT: subject,
            DATE: moment(maker.addDate).fromNow(),
            NAMEMAKER: maker.name,
            LOGINMAKER: maker.login
        })
            .then(() => {
                resolve(user);
            }).catch((err: any) => {
                console.error('Error send email', err);
                reject(err);
            })
    });
};

const getUser = async (id: string) => {
    return admin.auth()
        .getUser(id);
};

export const sendEmailWhenEpisodeIsRealised = functions.firestore
    .document('/people/{personId}')
    .onUpdate(async (snapshot, context) => {
        const person = snapshot.after.data();
        if (person && person.description && person.episodeSpotify && !person.emailSend) {
            const personId = context.params.personId;
            // const id_str = person.id_str;
            const votes = await admin.firestore()
                .collection(`/people/${personId}/votes`)
                .get();
            if (person && votes) {
                const emailProm: Promise<any>[] = [];
                const addedBy = await getUser(person.addedBy);
                emailProm.push(sendEmail(addedBy, person, personId, 'Le maker que tu as ajouté est venue dans le podcast', 'remerciment_add', 'Je tenais a te remercier infiniment pour ca !'));
                for (const vote of votes.docs) {
                    if (vote.id !== person.addedBy) {
                        const user = await getUser(vote.id);
                        emailProm.push(sendEmail(user, person, personId, 'Grace a toi il est la !', 'remerciment_vote', 'Pour une fois ton vote compte !'));
                    }
                }
                Promise.all(emailProm)
                    .then(() => {
                        return admin.firestore()
                            .collection(`/people`)
                            .doc(personId)
                            .update({ emailSend: new Date() }).then(() => {
                                console.log('Email sended');
                            }).catch((error: any) => {
                                console.error('Error update person', error);
                            });
                    })
                    .catch((err) => {
                        console.error('Error send all', err);
                    });
            } else {
                console.error('No email to send');
            }
        }
        return snapshot;
    });