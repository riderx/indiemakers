import { config, https, pubsub, firestore } from 'firebase-functions'
import admin from 'firebase-admin'
import { Person } from '../../services/types'
import { onboardingMessage } from '../../services/discord/bot/utils'
import { lateBot, morningBot } from './../../services/discord/bot/schedule'
import { getPerson, voteIfNotDone } from './users'
import { TwUser, twUserPromise } from './twitter'
import { sendUserToRevue } from './newletter'
import { transformURLtoTracked } from './tracker'

if (!admin.apps.length) {
  admin.initializeApp()
} else {
  admin.app() // if already initialized, use that one
}

process.env.CLIENT_PUBLIC_KEY = config().discord.bot_public_key
process.env.BOT_TOKEN = config().discord.bot_token

// export const getMakers = https.onRequest(async (req, res) => {
//   if (req.get('x-verceladmin-apikey') !== config().verceladmin.apikey) {
//     res.json({ error: 'unAuthorise' })
//     return
//   }
//   try {
//     const resultList = await admin
//       .firestore()
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
//   if (req.get('x-verceladmin-apikey') !== config().verceladmin.apikey) {
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
  const users = await admin
    .firestore()
    .collection('people')
    .get()
    .then((querySnapshot) =>
      querySnapshot.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }))
    )
  users.forEach(async (user) => {
    await admin
      .firestore()
      .collection('/people')
      .doc(user.id)
      .update({ updateDate: admin.firestore.Timestamp.now(), toUpdate: true })
      .then(() => {
        console.error('updateDate updated')
      })
      .catch((error) => {
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
      const twUser = await twUserPromise(name)
      if (twUser) {
        console.error('user', twUser)
        const newPerson: Person = {
          addedBy: uid,
          updateDate: admin.firestore.Timestamp.now(),
          addDate: admin.firestore.Timestamp.now(),
          toUpdate: true,
          id_str: twUser.id_str,
          name: twUser.name,
          login: twUser.screen_name,
          bio: await transformURLtoTracked(
            twUser.description || '',
            twUser.entities
          ),
          pic: twUser.profile_image_url_https.replace('_normal', ''),
          votes: 1,
          number: Number.MAX_SAFE_INTEGER,
        }
        let exist: admin.firestore.DocumentReference | null = null
        try {
          exist = await getPerson(newPerson.id_str)
        } catch (err) {
          console.error('Not exist', newPerson.id_str)
        }
        if (!exist) {
          return await admin
            .firestore()
            .collection('people')
            .add(newPerson)
            .then(async (person) => {
              await voteIfNotDone(person.id, uid)
              console.error('New account added')
              return { done: 'New account added' }
            })
            .catch((err) => {
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

export const calcVotesByPerson = firestore
  .document('/people/{personId}/votes/{voteId}')
  .onCreate(async (snapshot, context) => {
    const vote = snapshot.data()
    if (vote) {
      const { personId } = context.params
      // eslint-disable-next-line camelcase
      const { id_str } = vote
      const person = await admin.firestore().collection('people').doc(personId)
      const snap = await admin
        .firestore()
        .collection(`/people/${personId}/votes`)
        .get()
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

export const onCreateUser = firestore
  .document('/users/{uid}')
  .onCreate(async (snapshot) => {
    const user = snapshot.data()
    if (user && user.email && user.email !== '') {
      await sendUserToRevue(user.email, user.first_name)
    }
  })

export const onCreateDiscord = firestore
  .document('/discord/{uid}')
  .onCreate(async (snapshot, context) => {
    const { uid } = context.params
    const user = snapshot.data()
    if (user) {
      await onboardingMessage(user as any)
      await admin.firestore().collection('discord').doc(uid).update({
        onboardingSend: true,
      })
    }
  })

export const onUpdateDiscord = firestore
  .document('/discord/{uid}')
  .onUpdate(async (snapshot, context) => {
    const { uid } = context.params
    const onboardingSend = snapshot.before.data().onboardingSend
    if (!onboardingSend) {
      const user = snapshot.after.data()
      if (user && !user.onboardingSend) {
        await onboardingMessage(user as any)
        await admin.firestore().collection('discord').doc(uid).update({
          onboardingSend: true,
        })
      }
    }
  })

export const onUpdatePeople = firestore
  .document('/people/{personId}')
  .onUpdate(async (snapshot, context) => {
    const person: Person | undefined = <Person>snapshot.after.data()
    const { personId } = context.params
    if (person && person.bio && person.toUpdate === true) {
      const twUser: TwUser | null = await twUserPromise(person.login)
      const { name } = twUser
      const bio = await transformURLtoTracked(
        twUser.description || person.bio,
        twUser ? twUser.entities : null
      )
      const pic = twUser
        ? twUser.profile_image_url_https.replace('_normal', '')
        : person.pic
      if (bio !== person.bio || pic !== person.pic || name !== person.name) {
        await admin
          .firestore()
          .collection('/people')
          .doc(personId)
          .update({ bio, pic, name, toUpdate: false })
          .then(() => {
            console.error('bio updated', personId)
          })
          .catch((error) => {
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
    console.error('This will be run every hours at **:07 AM Paris!')
    await rssToFirebase()
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
function rssToFirebase() {
  throw new Error('Function not implemented.')
}
