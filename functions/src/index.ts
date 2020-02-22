import { sendWithTemplate } from './email';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TwitterApiToken } from './twitter_api';
import { moment } from './moment';
const Twitter = require('twitter');
import axios from 'axios';
import * as findUrl from 'get-urls';
import * as findMentions from 'mentions';
import * as findHashtags from 'find-hashtags';
import { PixelMeApiToken, PixelsId } from './pixelMe_api';
import { Timestamp } from '@google-cloud/firestore';

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
interface Person {
    addedBy: string;
    addDate: Timestamp;
    emailSend: boolean | Timestamp;
    id_str: string;
    name: string;
    login: string;
    description?: string;
    episode?: {
        Spotify?: string;
    }
    bio: string;
    pic: string;
    votes: number;
    number: number;
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

const bestKey = (url: string): string => {
    if (url.indexOf('twitter.com/hashtag/') !== -1) {
        return `H_${url.split('/').pop()}`;
    }
    if (url.indexOf('twitter.com/') !== -1) {
        return url.split('/').pop() || url;
    }
    if (url.indexOf('/') !== -1 && url.indexOf('/') < (url.length - 1)) {
        return url.split('/').pop() || url;
    }
    return url;
}

const shortURLPixel = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const key = bestKey(url);
        axios.post('/redirects', {
            url,
            key,
            pixels_ids: PixelsId,
            domain: 'imf.to',
        })
            .then((response) => {
                if (response && response.data && response.data.shorten) {
                    console.log('new link', response.data);
                    resolve(response.data.shorten);
                } else {
                    console.error('shorten error, no shorten found', response);
                    resolve(url);
                }
            })
            .catch((error) => {
                if (error.response.data.error_message === "Key already taken for this domain") {
                    resolve(`https://imf.to/${key}`);
                } else {
                    console.error('shorten error', error.response.data, error);
                    resolve(url);
                }
            });
    });

};

const findInTwUrls = (url: string, twUrls: TwUrl[]): string => {
    console.log('twUrls', twUrls);
    const found = twUrls.find((twUrl) => {
        if (twUrl.url === url) {
            return twUrl.expanded_url;
        }
        return null;
    });
    return found ? found.expanded_url : url;
}

const transformURLtoTracked = async (text: string, entities: TwEntities | null) => {
    let newDescription = '' + text;
    const links = Array.from(findUrl(text));
    const hashtags = findHashtags(text);
    const mentions = findMentions(text).get();
    for (const link of links) {
        let newHref = link;
        try {
            if (link.indexOf('https://imf.to/') === -1) {
                if (entities) {
                    const twUrl = findInTwUrls(link, entities.description.urls);
                    newHref = await shortURLPixel(twUrl);
                } else {
                    newHref = await shortURLPixel(link);
                }
            }
            newDescription = newDescription.split(link).join(newHref);
        } catch (err) {
            console.error('error transform link', link, err);
        }
    }
    for (const hashtag of hashtags) {
        const hHashtag = `#${hashtag}`;
        let newHref = `https://twitter.com/hashtag/${hashtag}`;
        try {
            newHref = await shortURLPixel(newHref);
        } catch (err) {
            console.error('error transform hashtag', hashtag, err);
        }
        newDescription = newDescription.split(hHashtag).join(newHref);
    }
    for (const mention of mentions) {
        const mMention = mention.substring(1);
        let newHref = `https://twitter.com/${mMention}`;
        try {
            newHref = await shortURLPixel(newHref);
        } catch (err) {
            console.error('error transform mention', mention, err);
        }
        newDescription = newDescription.split(mention).join(newHref);
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
                const newPerson: Person = {
                    addedBy: uid,
                    addDate: Timestamp.now(),
                    emailSend: true,
                    id_str: twUser.id_str,
                    name: twUser.name,
                    login: twUser.screen_name,
                    bio: await transformURLtoTracked(twUser.description || '', twUser.entities),
                    pic: `https://avatars.io/twitter/${twUser.screen_name}`,
                    votes: 1,
                    number: Number.MAX_SAFE_INTEGER,
                }
                let exist: FirebaseFirestore.DocumentReference | null = null;
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

const sendEmail = (user: any, maker: Person, makerId: string, subject: string, template: string, previewText: string) => {
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
            DATE: moment(maker.addDate.toDate()).fromNow(),
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
        const person: Person | undefined = snapshot.after.data() as Person;
        const personId = context.params.personId;
        if (person && person.description) {
            const description = await transformURLtoTracked(person.description, null);
            if (description !== person.description) {
                await admin.firestore()
                    .collection(`/people`)
                    .doc(personId)
                    .update({ description }).then(() => {
                        console.log('description updated');
                    }).catch((error: any) => {
                        console.error('Error update person', error);
                    });
            }
        }
        if (person && person.bio) {
            let twUser: TwUser | null = null;
            if (person.bio.indexOf('https://t.co') !== -1) {
                twUser = await twUserPromise(person.login)
            }
            const bio = await transformURLtoTracked(person.bio, twUser ? twUser.entities : null);
            if (bio !== person.bio) {
                await admin.firestore()
                    .collection(`/people`)
                    .doc(personId)
                    .update({ bio }).then(() => {
                        console.log('bio updated');
                    }).catch((error: any) => {
                        console.error('Error update person', error);
                    });
            }
        }
        if (!person.number) {
            const update = { emailSend: true, number: Number.MAX_SAFE_INTEGER };
            await admin.firestore()
                .collection(`/people`)
                .doc(personId)
                .update(update).then(() => {
                    console.log('emailSend updated');
                }).catch((error: any) => {
                    console.error('Error update emailSend', error);
                });
        }
        if (person && person.description && !person.emailSend) {
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