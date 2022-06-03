import axios from "axios"
import dayjs from "dayjs"
import { getFirestore } from "firebase-admin/firestore"
import { getAllAllProject } from "../../services/discord/bot/project"
import { updateIncomeAllProject } from "../../services/discord/bot/stripe"
import { resetUserStreak, resetProjectStreak } from "../../services/discord/bot/tasks"
import { usersViewStreak } from "../../services/discord/bot/user"
import { getAllUsers } from "../../services/firebase/discord"
import { personalVocalReminder, personalTaskReminder, personalFridayTaskReminder, personalModayReminder } from "./schedule"
import { DiscordConfig, User, Embed } from "./types"

const { post } = axios

export const getConfig = async () => {
  const res = await getFirestore().collection('bot').doc('config').get()
  const data = res.data() as DiscordConfig
  return data
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const getUserUrl = (user: User) => `https://indiemakers.fr/makers/${encodeURIComponent(user?.username)}`

export const saveRateLimit = (limit: string | number) => {
  console.error('sendChannel x-ratelimit-reset-after', limit)
  return getFirestore()
    .collection('bot')
    .doc('config')
    .update({
      discordResetAfter: Number(limit) * 1000,
    })
}

export const sendError = async (err: unknown) => {
  try {
    await getFirestore()
      .collection('errors')
      .add({ ...(err as any), createdAt: new Date().toISOString() })
  } catch (err) {
    console.error(err)
  }
  Promise.resolve()
}

export const openChannel = async (userId: string): Promise<any> => {
  const url = 'https://discord.com/api/v8/users/@me/channels'
  const data = await getConfig()
  if (!data) {
    return Promise.resolve(undefined)
  }
  const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : data.discord.bot_token}`,
  }
  if (data.discordResetAfter && data.discordResetAfter > 0) {
    console.error('Sleep a bit', data.discordResetAfter)
    await sleep(data.discordResetAfter)
  }
  try {
    const res = await post(url, { recipient_id: userId }, { headers })
    if (res?.headers['x-ratelimit-reset-after'] && !res?.headers['x-ratelimit-remaining']) {
      await saveRateLimit(res.headers['x-ratelimit-reset-after'])
    } else if (data.discordResetAfter && data.discordResetAfter > 0) {
      await saveRateLimit(0)
    }
    return res.data
  } catch (err: any) {
    if (err.response) {
      if (err.response.headers['x-ratelimit-reset-after']) {
        await saveRateLimit(err.response.headers['x-ratelimit-reset-after'])
      }
    }
    return sendError({
      function: 'openChannel',
      headers,
      userId,
      url,
      error: JSON.stringify(err),
    })
  }
}

export const sendChannel = async (channelId: string, content: string, embed: Embed | undefined = undefined): Promise<any> => {
  const url = `https://discord.com/api/v8/channels/${channelId}/messages`
  const data = await getConfig()
  if (!data) {
    return Promise.resolve(undefined)
  }

  const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : data.discord.bot_token}`,
  }
  const body: any = { content }
  if (embed) {
    body.embed = embed
  }
  if (data.discordResetAfter && data.discordResetAfter > 0) {
    console.error('Sleep a bit', data.discordResetAfter)
    await sleep(data.discordResetAfter + 1)
  }
  try {
    const res = await post(url, body, { headers })
    if (res?.headers['x-ratelimit-reset-after'] && !res?.headers['x-ratelimit-remaining']) {
      await saveRateLimit(res.headers['x-ratelimit-reset-after'])
    } else if (data.discordResetAfter && data.discordResetAfter > 0) {
      await saveRateLimit(0)
    }
    return res.data
  } catch (err: any) {
    if (err.response) {
      if (err.response.headers['x-ratelimit-reset-after']) {
        await saveRateLimit(err.response.headers['x-ratelimit-reset-after'])
      }
    }
    return sendError({
      function: 'sendChannel',
      headers,
      body,
      url,
      error: JSON.stringify(err),
    })
  }
}

export const onboardingMessage = async (user: User) => {
  try {
    const config = await getConfig()
    const channel = await openChannel(user.userId)
    console.error('channel', channel)
    await sendChannel(
      channel.id,
      `Bienvenue dans la communauté INDIE MAKERS ❤️

Je suis le bot de la communauté !
Mon but c'est t'aider a etre plus régulier sur tes projets.

Pour ça, je favorise les interactions entre les makers(membres) de la communauté!
Je te permet de distribuer du karma aux membres qui partager et aide les autres.

Avec mes commande tu peux mettre en avant tes projets sur le site indiemakers.fr
crée des taches, des post ou des revenue sur tes projets !

Je suis la aussi pour crée des moments d'echanges particulier entre vous.
Comme le résumé du lundi.
`
    )
    await sendChannel(config.channel_general, `@everyone C'est le premier karma de <@${user.userId}> , bienvenue <3`)
    await sleep(20)
    await sendChannel(
      channel.id,
      `Prends 5 minutes pour te présenter sur le salon <#${config.channel_intro}>
  Tu peu utiliser ce modèle :
  `
    )
    await sleep(20)
    await sendChannel(
      channel.id,
      `
  Salut Les INDIE MAKERS! 🕉
  Moi c'est XXX, j'ai XX ans et je viens de XX.
  Dans la vie je suis XXX .
  J'ai plusieurs projets à côté, comme:
  - XXX une app de XXX qui fait XXX de revenu
  - XXX un site pour les XXX, pas de revenu
  - XXX que j'ai abandonné car XXX
  Je fais des projets dans le but de XXX.
  Je vous ai rejoints dans le but de XXX.
  Ravi d'etre parmi vous !
  `
    )
    await sleep(20)
    await sendChannel(
      channel.id,
      `Ton profil est maintenant visible ici: ${getUserUrl(user)}
  `
    )
    await sleep(25)
    await sendChannel(
      channel.id,
      `Tu peux l'enrichir depuis la communauté avec la commande:

  \`/im maker modifier nom:${user.name || 'Martin'}\`

  Si tu souhaite voir la liste, des champs possibles:
  \`/im maker aide\`

  N'oublie pas, pour ajouter un champ à une commande, utilise la touche TAB

  **Mes commande fonctione uniquement dans un salon**, prend <#${config.channel_bip}> il est fait opour ça !`
    )
    await sleep(25)
    await sendChannel(
      channel.id,
      `
  Pense à donner du karma aux makers qui prennent le temps de t'aider !
  Tu peux le faire avec la commande \`/im karma donner maker:@martin \`
  `
    )
    await sleep(5)
    await sendChannel(
      channel.id,
      `Pour apprendre à m'utiliser (le bot) il y a une petite documentation juste ici:
https://indiemakers.gitbook.io/bot
  `
    )
    await sleep(15)
    await sendChannel(
      channel.id,
      `voici un petit tuto vidéo pour te montrer comment crée ta premiere tache sur un projet:
https://www.youtube.com/watch?v=qrXN3Mai1Gw
  `
    )
    await sleep(15)
    await sendChannel(channel.id, `Ps: n'attend pas de réponse de ma part ici, je ne sais pas encore lire tes messages !`)
    await sleep(15)
    await sendChannel(channel.id, `Si t'as des question demande aux utilisateur avec le rôle Moderateur !`)
  } catch (err) {
    console.error('onboardingMessage', err)
  }
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
