import dayjs from 'dayjs'
import { getAllAllProject } from './project'
import { updateIncomeAllProject } from './stripe'
import { resetProjectStreak, resetUserStreak } from './tasks'
import { getAllUsers, User, usersViewStreak } from './user'
import { getConfig, lastDay, lastWeek, openChannel, sendChannel } from './utils'

const personalTaskReminder = async (users: User[]) => {
  await Promise.all(
    users.map((usr) => {
      const lastTaskAt = dayjs(usr.lastTaskAt)
      if (
        usr.taskReminder &&
        usr.taskReminder === 'true' &&
        usr.streak > 0 &&
        usr.lastTaskAt &&
        lastTaskAt.isAfter(lastDay())
      ) {
        return openChannel(usr.userId).then((channel) => {
          console.error('personalReminder', usr.userId)
          return sendChannel(
            channel.id,
            `Tu as actuellement ${usr.streak} 🔥. Soit ${usr.streak} jours consécutif passé sur tes projets !
Si tu veux les conserver, fait une tache aujourd'hui et poste la !
Même 10 min, ça compte !
10 min * 365 jours = 60 heures sur ton projet a la fin de l'année ❤️
\`/im tache\` sur le channel construire en public`
          )
        })
      } else {
        return Promise.resolve()
      }
    })
  )
}

const personalFridayTaskReminder = async (users: User[]) => {
  if (dayjs().day() === 5) {
    await Promise.all(
      users.map((usr) => {
        const lastTaskAt = dayjs(usr.lastTaskAt)
        if (
          usr.taskReminder &&
          usr.taskReminder === 'true' &&
          usr.streak === 0 &&
          usr.lastTaskAt &&
          lastTaskAt.isBefore(lastWeek())
        ) {
          return openChannel(usr.userId).then((channel) => {
            console.error('personalReminder', usr.userId)
            return sendChannel(
              channel.id,
              `Cela fait plus d'une semaine que tu n'as pas posté de tache dans la communauté.
N'oublie pas de partager ce que tu fait c'est essentiel pour béneficier de l'effets cummulée de la communauté !
Chaque jour une petite tache crée l'habitude d'etre un maker !
C'est cette habitude qui te feras atteindre tes objectifs !
Lance toi : \`/im tache\` sur le channel construire en public`
            )
          })
        } else {
          return Promise.resolve()
        }
      })
    )
  }
}

const personalModayReminder = async (users: User[]) => {
  await Promise.all(
    users.map((usr) => {
      if (usr.taskReminder && usr.taskReminder === 'true' && usr.streak > 0) {
        return openChannel(usr.userId).then((channel) => {
          console.error('personalReminder', usr.userId)
          return sendChannel(
            channel.id,
            `C'est l'heure de faire ton résumé de la semaine sur tes projets :slight_smile: sur le salon General de la communauté indie makers .
C'est notre petit rituel du lundi pour se motiver et échanger sur nos avancés !
Ce moment est super important pour crée du lien entre tous les membres, n'hésite pas a répondre aux autres et a poser des questions !`
          )
        })
      } else {
        return Promise.resolve()
      }
    })
  )
}

const personalVocalReminder = async (users: User[]) => {
  await Promise.all(
    users.map((usr) => {
      if (usr.taskReminder && usr.taskReminder === 'true' && usr.streak > 0) {
        return openChannel(usr.userId).then((channel) => {
          console.error('personalReminder', usr.userId)
          return sendChannel(
            channel.id,
            `C'est l'heure de l'appel mensuel sur le general vocal ! Ne soit pas timide, c'est difficile pour tout le monde au debut, prend toi une biere met toi alaise et c'est parti !`
          )
        })
      } else {
        return Promise.resolve()
      }
    })
  )
}

export const lateBot = async () => {
  const data = await getConfig()
  if (data) {
    try {
      await sendChannel(
        data.channel_bip,
        "Hey Makers, il est temps de noter vos taches dans vos projets et d'aller chill !"
      )
      const users = await getAllUsers()
      if (dayjs().day() === 1 && dayjs().date() < 8) {
        await sendChannel(
          data.channel_general,
          `C'est l'heure de l'appel mensuel sur le general vocal ! 💪`
        )
        await personalVocalReminder(users)
      }
      await personalTaskReminder(users)
      await personalFridayTaskReminder(users)
    } catch (err) {
      console.error(err)
    }
  }
}

export const morningBot = async () => {
  try {
    const data = await getConfig()
    if (data) {
      const users = await getAllUsers()
      const projects = await getAllAllProject(users)
      const updatedUsers = await Promise.all(
        users.map((usr) => {
          return resetUserStreak(usr)
        })
      )
      await Promise.all(
        projects.map((proj) => {
          return resetProjectStreak(proj.userId, proj)
        })
      )
      const usersInfoCards = usersViewStreak(updatedUsers)
      if (usersInfoCards.length > 0) {
        await sendChannel(
          data.channel_bip,
          `Hey Makers, Encore une belle journée pour shipper 🚤 !

Continuez comme ça :`
        )
        for (let index = 0; index < usersInfoCards.length; index++) {
          const card = usersInfoCards[index]
          // console.error('card', card)
          await sendChannel(data.channel_bip, '', card)
        }
      } else {
        await sendChannel(
          data.channel_bip,
          `Hey Makers, Personne n'as shipper 🚤 cette semaine 😢 !`
        )
      }
      if (dayjs().day() === 1) {
        await sendChannel(
          data.channel_general,
          `Hey Makers, Faites moi un petit récap de votre semaine passé MINIMUM :
  - **1 point 👍**
  - **1 point 👎**`
        )
        await personalModayReminder(users)
        await updateIncomeAllProject()
        if (dayjs().date() < 8) {
          await sendChannel(
            data.channel_general,
            `Ce soir a 18h (UTC/GMT +1 heure) c'est l'appel mensuel sur le general vocal !
Passe faire un tour et partager avec les autres makers !`
          )
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
}
