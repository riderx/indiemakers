import dayjs from 'dayjs'
import { getAllUsers, getConfig } from '../../../services/firebase/discord'
import { User } from '../../../services/types'
import { getAllAllProject } from './project'
import { updateIncomeAllProject } from './stripe'
import { resetProjectStreak, resetUserStreak } from './tasks'
import { usersViewStreak } from './user'
import { lastDay, lastWeek, openChannel, sendChannel } from './utils'

export const personalTaskReminder = async (users: User[]) => {
  const config = await getConfig()
  await Promise.all(
    users.map(async (usr) => {
      const lastTaskAt = dayjs(usr.lastTaskAt)
      if (usr.taskReminder && usr.taskReminder === 'true' && usr.streak > 0 && usr.lastTaskAt && lastTaskAt.isBefore(lastDay())) {
        const channel = await openChannel(usr.userId)
        console.error('personalReminder', usr.userId)
        return sendChannel(
          channel.id,
          `Tu as actuellement ${usr.streak} 🔥. Soit ${usr.streak} jours consécutif passé sur tes projets !
Si tu veux les conserver, fait une tache aujourd'hui et poste la !
Même 10 min, ça compte !
10 min * 365 jours = 60 heures sur ton projet a la fin de l'année ❤️
\`/im tache\` sur le channel <#${config.channel_bip}>`
        )
      } else {
        return Promise.resolve()
      }
    })
  )
}

export const personalFridayTaskReminder = async (users: User[]) => {
  const config = await getConfig()
  await Promise.all(
    users.map(async (usr) => {
      const lastTaskAt = dayjs(usr.lastTaskAt)
      if (usr.taskReminder && usr.taskReminder === 'true' && usr.streak === 0 && usr.lastTaskAt && lastTaskAt.isBefore(lastWeek())) {
        const channel = await openChannel(usr.userId)
        console.error('personalReminder', usr.userId)
        return sendChannel(
          channel.id,
          `Cela fait plus d'une semaine que tu n'as pas posté de tache dans la communauté.
N'oublie pas de partager ce que tu fait c'est essentiel pour béneficier de l'effets cummulée de la communauté !
Chaque jour une petite tache crée l'habitude d'etre un maker !
C'est cette habitude qui te feras atteindre tes objectifs !
Lance toi : \`/im tache\` sur le channel <#${config.channel_bip}>`
        )
      } else {
        return Promise.resolve()
      }
    })
  )
}

export const personalModayReminder = async (users: User[]) => {
  const config = await getConfig()
  await Promise.all(
    users.map(async (usr) => {
      if (usr.userId && usr.mondayReminder && usr.mondayReminder === 'true') {
        try {
          const channel = await openChannel(usr.userId)
          console.error('personalReminder', usr.userId)
          await sendChannel(
            channel.id,
            `C'est l'heure de faire ton résumé de la semaine :slight_smile: sur le salon <#${config.channel_general}>.
C'est notre rituel du lundi pour se motiver et échanger sur nos avancés !
Ce moment est super important pour crée du lien entre tous les membres, n'hésite pas a répondre aux autres et a poser des questions !`
          )
          return sendChannel(
            channel.id,
            `C'est aussi un moment pour toi pour partager en public ce que tu fait.
Apres ton post fait \`/im post ajouter\` pour que ton post apparaisse sur le site indiemakers.fr
Voici une video pour te montrer https://www.youtube.com/watch?v=Z8q4HNhiwLg`
          )
        } catch (err) {
          console.error('personalModayReminder', err)
        }
      } else {
        return Promise.resolve()
      }
    })
  )
}

export const personalVocalReminder = async (users: User[]) => {
  await Promise.all(
    users.map(async (usr) => {
      if (usr.voiceReminder && usr.voiceReminder === 'true') {
        const channel = await openChannel(usr.userId)
        console.error('personalReminder', usr.userId)
        return sendChannel(
          channel.id,
          `C'est l'heure de l'apero mensuel sur l'indieverse ! Ne soit pas timide, c'est difficile pour tout le monde au debut, prend toi une biere met toi alaise et c'est parti !
app.indiemakers.space/invite/iRaqGsbWMcMTdoBZj`
        )
      } else {
        return Promise.resolve()
      }
    })
  )
}

export const lateBot = async () => {
  const config = await getConfig()
  if (config) {
    try {
      const users = await getAllUsers()
      const usersInfoCards = usersViewStreak(users)
      if (usersInfoCards.length > 0) {
        await sendChannel(
          config.channel_bip,
          "@everyone Hey Makers, il est temps de noter vos taches du jour dans vos projets et d'aller chill !"
        )
      }
      if (dayjs().day() === 1 && dayjs().date() < 8) {
        await sendChannel(
          config.channel_general,
          `C'est l'heure de l'apero mensuel sur le general vocal ! 💪
app.indiemakers.space/invite/iRaqGsbWMcMTdoBZj`
        )
        await personalVocalReminder(users)
      }

      await personalTaskReminder(users)
      if (dayjs().day() === 5) {
        await personalFridayTaskReminder(users)
      }
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
      }
      if (dayjs().day() === 1) {
        await sendChannel(
          data.channel_general,
          `@everyone Hey Makers, C'est l'heure du récap de ta semaine passé :
  - **1 point 👍**
  - **1 point 👎**
  - **1 point 🔮 (A faire cette semaine)**
=> Publie le sur le site en faisant \`/im post ajouter\` juste après ton message discord, pour construire en public.`
        )
        await personalModayReminder(users)
        await updateIncomeAllProject()
        //         if (dayjs().date() < 8) {
        //           await sendChannel(
        //             data.channel_general,
        //             `Ce soir a 18h10 (UTC/GMT +1 heure) c'est l'appel mensuel sur le general vocal !
        // Passe faire un tour et partager avec les autres makers !`
        //           )
        //         }
      }
    }
  } catch (err) {
    console.error(err)
  }
}
