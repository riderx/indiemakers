import { sendWithTemplate } from './email';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TwitterApiToken } from './twitter_api';
import { moment } from './moment';
const Twitter = require('twitter');
import axios from 'axios';
import * as linkify from "linkifyjs";
import { PixelMeApiToken } from './pixelMe_api';
require("linkifyjs/plugins/mention")(linkify);
require("linkifyjs/plugins/ticket")(linkify);
// PixelMeApiToken
const client = new Twitter(TwitterApiToken);

axios.defaults.baseURL = 'https://api.pixelme.me';
axios.defaults.headers.common['Authorization'] = `Bearer ${PixelMeApiToken}`;

interface TwEntities {
    url: {
        hashtags: [],
        symbols: [],
        user_mentions: [],
        urls: TwUrl[]
    },
    description: {
        hashtags: [],
        symbols: [],
        user_mentions: [],
        urls: TwUrl[]
    },
}
interface TwUrl {
    url: string,
    expanded_url: string,
    display_url: string,
    indices: [
        number,
        number
    ]
}
interface TwUser {
    created_at: string;
    default_profile_image: boolean;
    default_profile: boolean;
    description?: string | null;
    entities: TwEntities,
    favourites_count: number;
    followers_count: number;
    friends_count: number;
    id_str: string;
    id: number;
    listed_count: number;
    location?: string | null;
    name: string;
    profile_banner_url?: string;
    profile_image_url_https: string;
    protected: boolean;
    screen_name: string;
    statuses_count: number;
    url?: string | null;
    verified: boolean;
    withheld_in_countries?: string[];
    withheld_scope?: string;
};
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

const twUserPromise = (screen_name: string): Promise<TwUser> => {
    return new Promise((resolve, reject) => {
        const params = { screen_name, include_entities: true };
        client.get('users/show', params, async (error: any, user: TwUser, response: any) => {
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
// curl -H "Authorization: Bearer <your_token>" \
// -d '{"url": "http://blog.intercom.com/how-to", "pixels_ids": ["nxs_3344", "fb_109138409374"], "domain": "rocks.awesome.me", "key": "black-friday"}' \
// "https://api.pixelme.me/redirects"

// Make a request for a user with a given ID

const shortURLPixel = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.post('/redirects', {
            url,
            pixels_ids: ["indiemakerfb", "Ganalytics"]
        })
            .then((response) => {
                console.log(response);
                if (response && response.data && response.data.shorten) {
                    resolve(response.data.shorten);
                } else {
                    console.error('shorten error, no shorten found', response.data);
                    resolve(url);
                }
            })
            .catch((error) => {
                console.error('shorten error', error);
                resolve(url);
            });
    });

};

const findInTwUrls = (url: string, twUrls: TwUrl[]): string => {
    const found = twUrls.find((twUrl) => {
        if (twUrl.display_url === url) {
            return twUrl.expanded_url;
        }
        return null;
    });
    return found ? found.expanded_url : url;
}

const transformURLtoTracked = async (description: string, entities: TwEntities | null) => {
    const newDescription = '' + description;
    const links = linkify.find(description);

    for (const link of links) {
        let newHref = link.href;
        if (link.type === 'url' && link.href.indexOf('https://pxlme.me/') === -1) {
            if (entities) {
                const twUrl = findInTwUrls(link.href, entities.description.urls);
                newHref = await shortURLPixel(twUrl);
            } else {
                newHref = await shortURLPixel(link.href);
            }
        } else if (link.type === 'hashtag') {
            newHref = 'https://twitter.com/hashtag/' + link.href.substring(1);
        } else if (link.type === 'mention') {
            newHref = 'https://twitter.com/' + link.href.substring(1);
        }
        newDescription.split(link.href).join(newHref);
    }
    return newDescription;
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
                    bio: transformURLtoTracked(twUser.description || '', twUser.entities),
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

export const calcLikesByPerson = functions.firestore
    .document('/people/{personId}/likes/{likeId}')
    .onCreate(async (snapshot, context) => {
        const like = snapshot.data();
        if (like) {
            const personId = context.params.personId;
            const id_str = like.id_str;
            const person = await getPersonById(personId);
            const snap = await admin.firestore()
                .collection(`/people/${personId}/likes`)
                .get();
            const likesTotal = snap.size;
            if (person && snap && likesTotal) {
                return person.update({ likes: likesTotal }).then(() => {
                    console.log('Updates likes', id_str, likesTotal);
                }).catch((error) => {
                    console.error('Error', error);
                });
            } else {
                console.error('No Like');
            }
        }
        return snapshot;
    });

const sendEmail = (user: any, maker: any, makerId: string, subject: string, template: string, previewText: string) => {
    return new Promise((resolve, reject) => {
        const linkEp = `https://indiemaker.fr/#/episode/${makerId}`;
        const tweet = `J'écoute le podcast @indiemakerfr avec @${maker.login} 🚀 ${linkEp}`
        const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
        sendWithTemplate('indiemakerfr@gmail.com', user.email, subject, previewText, template, {
            LINKEPISODE: linkEp,
            TWEETLINK: tweetLink,
            MC_PREVIEW_TEXT: previewText,
            NAME: user.displayName || 'Elon Musk',
            SUBJECT: subject,
            DATE: moment(maker.addDate.toMillis()).fromNow(),
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

export const onUpdatePeople = functions.firestore
    .document('/people/{personId}')
    .onUpdate(async (snapshot, context) => {
        const person = snapshot.after.data();
        const personId = context.params.personId;
        if (person && person.description) {
            const newText = await transformURLtoTracked(person.description, null);
            if (newText !== person.description) {
                await admin.firestore()
                    .collection(`/people`)
                    .doc(personId)
                    .update({ description: newText }).then(() => {
                        console.log('description updated');
                    }).catch((error: any) => {
                        console.error('Error update person', error);
                    });
            }
        }
        if (person && person.bio) {
            const newText = await transformURLtoTracked(person.bio, null);
            if (newText !== person.bio) {
                await admin.firestore()
                    .collection(`/people`)
                    .doc(personId)
                    .update({ bio: newText }).then(() => {
                        console.log('bio updated');
                    }).catch((error: any) => {
                        console.error('Error update person', error);
                    });
            }
        }
        if (person && person.description && person.episodeSpotify && !person.emailSend) {
            // send EMAIL for episode Ready
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
                await Promise.all(emailProm)
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