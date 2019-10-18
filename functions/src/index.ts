import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();
const TwitterApiToken = '';

const getPerson = (id_str: string): Promise<FirebaseFirestore.DocumentReference | null> => {
    return admin.firestore()
        .collection('people')
        .where("id_str", "==", id_str)
        .get()
        .then(snapshot => {
            let result: FirebaseFirestore.DocumentReference | null = null;
            if (snapshot.empty) {
                console.log('No matching documents.');
                return null;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                result = doc.ref;
            });
            return result;
        })
        .catch(err => {
            console.log('Error getting documents', err);
            return null;
        });
}

const getVotes = (id_str: string, uid: string): Promise<boolean> => {
    return admin.firestore()
        .collection('votes')
        .where("uid", "==", uid)
        .where("id_str", "==", id_str)
        .get()
        .then(snapshot => {
            let result: boolean = false;
            if (snapshot.empty) {
                console.log('No matching documents.');
                return false;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                result = true;
            });
            return result;
        })
        .catch(err => {
            console.log('Error getting documents', err);
            return false;
        });
}

export const findTwiterUser = functions.https.onCall(async (data, context) => {
    const name = data.name;
    const uid = context.auth ? context.auth.uid : null;
    if (uid) {
        return await axios({
            method: 'get',
            url: `https://api.twitter.com/1.1/users/show?screen_name=${name}`,
            headers: { 'authorization': `Bearer ${TwitterApiToken}` },
        })
            .then((res) => {
                console.log(res);
                return res.data;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }
    return { error: 'not loggin' };
});

export const addTwiterUser = functions.https.onCall(async (data, context) => {
    const name = data.name;
    const uid = context.auth ? context.auth.uid : null;
    if (uid) {
        return await axios({
            method: 'get',
            url: `https://api.twitter.com/1.1/users/show?screen_name=${name}`,
            headers: { 'authorization': `Bearer ${TwitterApiToken}` },
        })
            .then(async (res) => {
                console.log(res);
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
                            return newuser;
                        }).catch((error) => {
                            console.error(error);
                            return error;
                        })
                }
                return { error: 'already exist' };
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }
    return { error: 'not loggin' };
});

export const voteTwiterUser = functions.https.onCall(async (data, context) => {
    const id_str = data.id_str;
    const uid = context.auth ? context.auth.uid : null;
    if (uid) {
        const exist = await getPerson(id_str);
        const voted = await getVotes(id_str, uid);
        if (!exist) {
            return { error: 'user not exist' };
        }
        if (!voted) {
            return await admin.firestore()
                .runTransaction(t => {
                    return t.get(exist)
                        .then(async doc => {
                            const docData = doc.data();
                            if (docData) {
                                const newVotes = docData.votes + 1;
                                t.update(exist, { votes: newVotes });
                                return await admin.firestore()
                                    .collection('votes')
                                    .add({
                                        uid: uid,
                                        name: name
                                    });
                            }
                            return;
                        });
                }).then(result => {
                    console.log('Transaction success!');
                    return { message: 'voted' };
                }).catch(err => {
                    return { error: err };
                });
        }
        return { error: 'already voted' };
    }
    return { error: 'not loggin' };
});

