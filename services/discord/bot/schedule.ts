import dayjs from 'dayjs'
import { getAllAllProject } from './project'
import { updateIncomeAllProject } from './stripe'
import { resetProjectStreak, resetUserStreak } from './tasks'
import { getAllUsers, User, usersViewStreak } from './user'
import { getConfig, openChannel, sendChannel } from './utils'

const personalTaskReminder = async (users: User[]) => {
  await Promise.all(
    users.map((usr) => {
      if (usr.taskReminder && usr.taskReminder === 'true' && usr.streak > 0) {
        return openChannel(usr.userId).then((channel) => {
          console.error('personalReminder', usr.userId)
          return sendChannel(
            channel.id,
            `Tu as actuellement ${usr.streak} 🔥 !
Si tu veux les conserver, fait une tache aujourd'hui sur tes projet même 10 min, ça compte !
10 min * 365 jours = 60 heures sur ton projet a la fin de l'année ❤️`
          )
        })
      } else {
        return Promise.resolve()
      }
    })
  )
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

export const lateBot = async () => {
  const data = await getConfig()
  if (data) {
    try {
      await sendChannel(
        data.channel_bip,
        "Hey Makers, il est temps de noter vos taches dans vos projets et d'aller chill !"
      )
      const users = await getAllUsers()
      await personalTaskReminder(users)
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
      }
    }
  } catch (err) {
    console.error(err)
  }
}
