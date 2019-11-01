import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TwitterApiToken } from './twitter_api';
const Twitter = require('twitter');

const client = new Twitter(TwitterApiToken);

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();

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
    console.log('person', person);
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
                console.log('user', user, 'response', response);
                resolve(user);
            } else {
                console.error('cannot find user', error, response);
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
                    console.error('not exist', newPerson.id_str);
                }
                if (!exist) {
                    return await admin.firestore()
                        .collection('people')
                        .add(newPerson)
                        .then(async (person) => {
                            await admin.firestore()
                                .collection(`/people/${person.id}/votes`)
                                .doc(uid)
                                .set({
                                    date: Date()
                                });
                            console.log('New account added');
                            return { done: 'New account added' };
                        }).catch((err) => {
                            console.error('cannot create', err);
                            return { error: 'cannot create' };
                        })
                } else {
                    return { error: 'already exist' };
                }
            }
            return { error: 'not found on api twitter' };
        } catch (err) {
            console.error('cannot find user', err);
            return { error: err };
        }
    }
    console.error('not loggin');
    return { error: 'not loggin' };
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
                    console.log('updates votes', id_str, votesTotal);
                }).catch((error) => {
                    console.error('error', error);
                });
            } else {
                console.error('no votes');
            }
        }
        return snapshot;
    });
