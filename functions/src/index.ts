import { config, https, pubsub, firestore } from 'firebase-functions'
import { initializeApp, getApps, getApp } from 'firebase-admin/app'
import { getFirestore, Timestamp, DocumentReference } from 'firebase-admin/firestore'
import { Person, User } from '../../services/types'
import { onboardingMessage } from './discord/bot/utils'
import { podcastToFirebase } from './../../services/firebase/podcasts'
import { lateBot, morningBot } from './discord/bot/schedule'
import { TwUser, useTwitter } from './../../services/twitter'
import { getPerson, voteIfNotDone } from './users'
import { sendUserToRevue } from './newletter'
import { transformURLtoTracked } from './tracker'

if (!getApps().length) {
  initializeApp()
} else {
  getApp() // if already initialized, use that one
}
const configSecret = config()

process.env.CLIENT_PUBLIC_KEY = configSecret.discord.bot_public_key
process.env.IMAGEKIT_KEY = configSecret.imagekit.key
process.env.BOT_TOKEN = configSecret.discord.bot_token
process.env.TWITTER_TOKEN = JSON.stringify({
  consumer_key: configSecret.twitter.consumer_key,
  consumer_secret: configSecret.twitter.consumer_secret,
  access_token_key: configSecret.twitter.access_token_key,
  access_token_secret: configSecret.twitter.access_token_secret,
})

const twitter = useTwitter(JSON.parse(process.env.TWITTER_TOKEN))

// export const getMakers = https.onRequest(async (req, res) => {
//   if (req.get('x-verceladmin-apikey') !== configSecret.verceladmin.apikey) {
//     res.json({ error: 'unAuthorise' })
//     return
//   }
//   try {
//     const resultList = await admin
//       .getFirestore()
//       .collection('people')
//       .orderBy('votes', 'desc')
//       .orderBy('addDate', 'asc')
//       .get()
//       .then((querySnapshot) =>
//         querySnapshot.docs.map((doc) =>
//           Object.assign(doc.data(), { id: doc.id })
//         )
//       )
//     res.json(resultList)
//   } catch (err) {
//     console.error('err', err)
//     res.json([])
//   }
// })

// export const addEp = https.onRequest(async (req, res) => {
//   if (req.get('x-verceladmin-apikey') !== configSecret.verceladmin.apikey) {
//     res.json({ error: 'unAuthorise' })
//     return
//   }
//   try {
//     await admin
//       .firestore()
//       .collection('episodes')
//       .doc(req.body.udi)
//       .update({ udi: req.body.udi })
//     res.json({ error: 'already done' })
//   } catch {
//     try {
//       await admin
//         .firestore()
//         .collection('episodes')
//         .doc(req.body.udi)
//         .set(req.body)
//       res.json({ status: 'done' })
//     } catch (err) {
//       res.json({ error: err })
//     }
//   }
// })

export const updateTwiterUser = pubsub.schedule('0 0 * * *').onRun(async () => {
  const users = await getFirestore()
    .collection('people')
    .get()
    .then((querySnapshot) => querySnapshot.docs.map((doc) => Object.assign(doc.data(), { id: doc.id })))
  users.forEach(async (user) => {
    await getFirestore()
      .collection('/people')
      .doc(user.id)
      .update({ updateDate: Timestamp.now(), toUpdate: true })
      .then(() => {
        console.error('updateDate updated')
      })
      .catch((error: any) => {
        console.error('Error update person', error)
      })
  })
  return null
})

export const addTwiterUser = https.onCall(async (data, context) => {
  const { name } = data
  const uid = context.auth ? context.auth.uid : null
  if (uid) {
    try {
      const twUser = await twitter.user(name)
      if (twUser) {
        console.error('user', twUser)
        const newPerson: Person = {
          addedBy: uid,
          updateDate: Timestamp.now(),
          addDate: Timestamp.now(),
          toUpdate: true,
          id_str: twUser.id_str,
          name: twUser.name,
          login: twUser.screen_name,
          bio: await transformURLtoTracked(twUser.description || '', twUser.entities),
          pic: twUser.profile_image_url_https.replace('_normal', ''),
          votes: 1,
          number: Number.MAX_SAFE_INTEGER,
        }
        let exist: DocumentReference | null = null
        try {
          exist = await getPerson(newPerson.id_str)
        } catch (err) {
          console.error('Not exist', newPerson.id_str)
        }
        if (!exist) {
          return await getFirestore()
            .collection('people')
            .add(newPerson)
            .then(async (person) => {
              await voteIfNotDone(person.id, uid)
              console.error('New account added')
              return { done: 'New account added' }
            })
            .catch((err: any) => {
              console.error('Cannot create', err)
              return { error: 'Cannot create' }
            })
        }
        return await voteIfNotDone(exist.id, uid)
      }
      return { error: 'Not found on api twitter' }
    } catch (err) {
      console.error('Cannot find user', err)
      return { error: err }
    }
  }
  console.error('Not loggin')
  return { error: 'Not loggin' }
})

export const calcVotesByPerson = firestore.document('/people/{personId}/votes/{voteId}').onCreate(async (snapshot, context) => {
  const vote = snapshot.data()
  if (vote) {
    const { personId } = context.params
    // eslint-disable-next-line camelcase
    const { id_str } = vote
    const person = await getFirestore().collection('people').doc(personId)
    const snap = await getFirestore().collection(`/people/${personId}/votes`).get()
    const votesTotal = snap.size
    if (person && snap && votesTotal) {
      return person
        .update({ votes: votesTotal })
        .then(() => {
          console.error('Updates votes', id_str, votesTotal)
        })
        .catch((error) => {
          console.error('Error', error)
        })
    }
    console.error('No votes')
  }
  return snapshot
})

export const onCreateUser = firestore.document('/users/{uid}').onCreate(async (snapshot) => {
  const user = snapshot.data()
  if (user && user.email && user.email !== '') {
    await sendUserToRevue(user.email, user.first_name)
  }
})

export const onCreateDiscord = firestore.document('/discord/{uid}').onCreate(async (snapshot, context) => {
  const { uid } = context.params
  const user = snapshot.data() as User
  if (user && user.userId) {
    await onboardingMessage(user)
    await getFirestore().collection('discord').doc(uid).update({
      onboardingSend: true,
    })
  }
})

export const onUpdateDiscord = firestore.document('/discord/{uid}').onUpdate(async (snapshot, context) => {
  const { uid } = context.params
  const user = snapshot.after.data() as User
  if (!user.onboardingSend) {
    if (user && !user.onboardingSend) {
      await onboardingMessage(user)
      await getFirestore().collection('discord').doc(uid).update({
        onboardingSend: true,
      })
    }
  }
})

export const onUpdatePeople = firestore.document('/people/{personId}').onUpdate(async (snapshot, context) => {
  const person: Person | undefined = <Person>snapshot.after.data()
  const { personId } = context.params
  if (person && person.bio && person.toUpdate === true) {
    const twUser: TwUser | null = await twitter.user(person.login)
    const { name } = twUser
    const bio = await transformURLtoTracked(twUser.description || person.bio, twUser ? twUser.entities : null)
    const pic = twUser ? twUser.profile_image_url_https.replace('_normal', '') : person.pic
    if (bio !== person.bio || pic !== person.pic || name !== person.name) {
      await getFirestore()
        .collection('/people')
        .doc(personId)
        .update({ bio, pic, name, toUpdate: false })
        .then(() => {
          console.error('bio updated', personId)
        })
        .catch((error: any) => {
          console.error('Error update person', error)
        })
    }
  }
  return snapshot
})

// export const OnInteraction = firestore
//   .document('/interaction/{interactionId}')
//   .onCreate(async (snapshot, context) => {
//     const interaction: Interaction = snapshot.data() as Interaction
//     if (interaction) {
//       await discordInteraction(interaction)
//       const { interactionId } = context.params
//       await admin
//         .firestore()
//         .collection('interaction')
//         .doc(interactionId)
//         .delete()
//     }
//   })

export const scheduledRssToFirebase = pubsub
  .schedule('7 * * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    console.error('This will be run every hours at **:07 Paris!')
    await podcastToFirebase()
    return null
  })

export const scheduledBotBIP = pubsub
  .schedule('0 18 * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    console.error('This will be run every day at 18:00 AM Paris!')
    await lateBot()
    return null
  })

export const scheduledBotBIPMorning = pubsub
  .schedule('0 9 * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    console.error('This will be run every day at 9:00 AM Paris!')
    await morningBot()
    return null
  })
