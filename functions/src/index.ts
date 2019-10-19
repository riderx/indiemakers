import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { TwitterApiToken } from './twitter_api';

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

const getVotes = async (id_str: string, uid: string): Promise<boolean> => {
    const votes: boolean = await admin.firestore()
        .collection('votes')
        .where("uid", "==", uid)
        .where("id_str", "==", id_str)
        .get()
        .then(snapshot => {
            let result: boolean = false;
            if (snapshot.empty) {
                console.log('No votes', uid, id_str);
                return false;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                result = true;
            });
            return result;
        })
        .catch(err => {
            console.log('Error getting votes', err);
            return false;
        });
    console.log('votes', votes);
    return votes;
}

export const findTwiterUser = functions.https.onCall(async (data, context) => {
    const name = data.name;
    const uid = context.auth ? context.auth.uid : null;
    if (uid) {
        return await axios({
            method: 'get',
            url: `https://api.twitter.com/1.1/users/show?screen_name=${name}`,
            headers: { 'authorization': `OAuth oauth_consumer_key="${TwitterApiToken}"` },
        })
            .then((res) => {
                console.log(res);
                return res.data;
            })
            .catch((error) => {
                console.error('cannot find user', error);
                return { error: 'cannot find user' };
            });
    }
    console.error('not loggin');
    return { error: 'not loggin' };
});

export const addTwiterUser = functions.https.onCall(async (data, context) => {
    const name = data.name;
    const uid = context.auth ? context.auth.uid : null;
    if (uid) {
        return await axios({
            method: 'get',
            url: `https://api.twitter.com/1.1/users/show?screen_name=${name}`,
            headers: { 'authorization': `OAuth oauth_consumer_key="${TwitterApiToken}"` },
        })
            .then(async (res) => {
                console.log('twiter api', res);
                const newuser = {
                    addedBy: uid,
                    id_str: res.data.id_str,
                    name: res.data.name,
                    login: res.data.screen_name,
                    bio: res.data.description,
                    pic: res.data.profile_image_url_https,
                    votes: 1
                }
                const exist = await getPerson(newuser.id_str);
                if (!exist) {
                    return await admin.firestore()
                        .collection('people')
                        .add(newuser)
                        .then(() => {
                            console.log('New account added');
                            return { done: 'New account added' };
                        }).catch((error) => {
                            console.error(error);
                            return { error: 'cannot create' };
                        })
                }
                console.error('already exist');
                return { error: 'already exist' };
            })
            .catch((error) => {
                console.error(error);
                return { error: 'cannot create' };
            });
    }
    console.error('not loggin');
    return { error: 'not loggin' };
});

export const calcVotes = functions.firestore
    .document('/votes/{voteId}')
    .onCreate(async (snapshot, context) => {
        const vote = snapshot.data();
        if (vote) {
            const id_str = vote.id_str;
            const exist = await getPerson(id_str);
            const snap = await admin.firestore()
                .collection(`votes`)
                .where("id_str", "==", id_str)
                .get();
            const votesTotal = snap.size;
            if (exist && snap && votesTotal) {
                return exist.update({ votes: votesTotal }).then(() => {
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

export const voteTwiterUser = functions.https.onCall(async (data, context) => {
    const id_str = data.id_str;
    const uid = context.auth ? context.auth.uid : null;
    if (uid) {
        const exist = await getPerson(id_str);
        const voted = await getVotes(id_str, uid);
        if (!exist) {
            console.error('user not exist');
            return { error: 'user not exist' };
        }
        if (!voted) {
            console.log('voted', id_str, uid);
            return await admin.firestore()
                .collection('votes')
                .add({
                    uid: uid,
                    id_str: id_str
                });
        }
        console.error('already voted', id_str, uid);
        return { error: 'already voted' };
    }
    console.error('not loggin');
    return { error: 'not loggin' };
});

