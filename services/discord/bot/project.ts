import dayjs from 'dayjs'
import { getFirestore } from 'firebase-admin/firestore'
import getMetaData from 'metadata-scraper'
import { Interaction, ApplicationCommandInteractionDataOption } from '../command'
import { Embed, Income, Project, User } from '../../../services/types'
import { updateUser, getConfig } from '../../../services/firebase/discord'
import { TwitterApiToken, useTwitter } from '../../../services/twitter'
import { getStripeCharges, Charge } from './stripe'
import {
  embed,
  getFields,
  image,
  openChannel,
  sendChannel,
  sendTxtLater,
  sleep,
  transformKey,
  transformVal,
  t9r,
  LName,
  Langs,
  getUserUrl,
  l3s,
} from './utils'
import { createProjectIncome, deleteProjectIncome, getAllProjectsIncomes } from './incomes'

// eslint-disable-next-line no-unused-vars

const projectPublicKey = ['hashtag', 'name', 'category', 'emoji', 'color', 'cover', 'github', 'openSource', 'website', 'tasks', 'streak']
const projectProtectedKey = ['id', 'tasks', 'streak', 'bestStreak', 'createdAt', 'updatedAt', 'lastTaskAt']

const twitter = useTwitter(process.env.TWITTER_TOKEN ? (JSON.parse(process.env.TWITTER_TOKEN) as TwitterApiToken) : undefined)

const transforms: Langs[] = [
  t9r('color', 'couleur', 'Couleur'),
  t9r('name', 'nom', 'Nom'),
  t9r('cover', 'couverture', 'Couverture'),
  t9r('year', 'année', 'Année'),
  t9r('month', 'mois', 'Mois'),
  t9r('category', 'categorie', 'Categorie'),
  t9r('openSource', 'open_source', 'Open source'),
  t9r(
    'website',
    l3s('website', (d) => {
      return d.startsWith('https://') ? d : d.startsWith('http://') ? d.replace('http://', 'https://') : `https://${d}`
    }),
    'Site web',
    undefined,
    false
  ),
  t9r('github', 'github', 'Github', undefined, false),
  t9r('twitter', 'twitter', 'Twitter', undefined, false),
  t9r('emoji', 'emoji', 'Emoji'),
  t9r('hashtag', 'hashtag', '#️⃣'),
]

export const getAllProjects = async (userId: string, userName: string | undefined = undefined): Promise<Project[]> => {
  try {
    const documents = await getFirestore().collection(`discord/${userId}/projects`).where('hashtag', '!=', null).get()

    const projects: Project[] = []
    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      const data = (await doc.data()) as Project
      if (data !== undefined && data.hashtag && data.hashtag !== '') {
        projects.push({ userId, userName, id: doc.id, ...(data as Project) })
      }
    }
    return projects
  } catch (err) {
    console.error('getAllProjects', err)
    return []
  }
}

export const getAllAllProject = async (users: User[]): Promise<Project[]> => {
  const arrays: Project[][] = await Promise.all(
    users.map((usr: User) => {
      return getAllProjects(String(usr?.userId), usr?.username)
    })
  )
  const projects: Project[] = arrays.reduce((a, b) => a.concat(b), [])
  return projects
}

export const getProjectById = async (userId: string, hashtag: string): Promise<Project | null> => {
  try {
    const res = await getFirestore().collection(`discord/${userId}/projects`).doc(hashtag.toLowerCase()).get()
    const data = res.data()
    return data !== undefined ? (data as Project) : null
  } catch (err) {
    console.error('getProjectById', err)
    return null
  }
}

export const updateProject = async (userId: string, hashtag: string, project: Partial<Project>): Promise<Project> => {
  const lowHash = hashtag.toLowerCase()
  const projDoc = await getFirestore().collection(`discord/${userId}/projects`).doc(lowHash).get()
  if (!projDoc.exists) {
    const newProject: Project = Object.assign(
      {
        hashtag: '',
        name: '',
        description: '',
        category: '',
        website: '',
        logo: '',
        cover: '',
        emoji: '',
        color: '',
        tasks: 0,
        streak: 0,
        bestStreak: 0,
        incomes: 0,
        updatedAt: dayjs().toISOString(),
        createdAt: dayjs().toISOString(),
      },
      project
    )
    await getFirestore().collection(`discord/${userId}/projects`).doc(lowHash).set(newProject)
    return newProject
  }
  if (project.website) {
    try {
      const data = await getMetaData(project.website)
      if (!project.name && data.title) {
        project.name = data.title
      }
      if (!project.cover && data.image) {
        project.cover = data.image
      }
      if (!project.logo && data.icon) {
        project.logo = data.icon
      }
      if (!project.description && data.description) {
        project.description = data.description
      }
    } catch (err) {
      console.error('getMetaData', err, project.website)
    }
  }
  if (project.twitter) {
    try {
      const data = await twitter.user(project.twitter.split('/').pop() || '')
      if (!project.name && data.name) {
        project.name = data.name
      }
      if (!project.cover && data.profile_banner_url) {
        project.cover = data.profile_banner_url
      }
      if (!project.logo && data.profile_image_url_https) {
        project.logo = data.profile_image_url_https
      }
      if (!project.description && data.description) {
        project.description = data.description
      }
    } catch (err) {
      console.error('twitter', err, project.twitter)
    }
  }
  const data: Project = projDoc.data() as Project
  if (!data.name && project.name) {
    const config = await getConfig()
    const channel = await openChannel(userId)
    console.error('channel', channel)
    await sendChannel(
      channel.id,
      `💗 Il est temps d'envoyer 💌 ta première tâche au projet #${lowHash} avec:
\`/im tache ajouter hashtag:${lowHash} contenu:Ajout du projet sur INDIE MAKERS\`
Fait le sur le salon <#${config.channel_bip}>, il est fait pour ça, il est en silencieux pour tout le monde !`
    )
  }
  await projDoc.ref.update({ ...project, updatedAt: dayjs().toISOString() })
  return projDoc.data() as Project
}

const deleteProject = (userId: string, hashtag: string): Promise<any> => {
  return getFirestore().collection(`discord/${userId}/projects`).doc(hashtag.toLowerCase()).delete()
}

export const deleteAllProjectsTasks = async (userId: string, hashtag: string): Promise<void> => {
  try {
    const documents = await getFirestore().collection(`discord/${userId}/projects/${hashtag}/tasks`).get()
    const listDel: any[] = []
    documents.docs.forEach((doc) => {
      listDel.push(doc.ref.delete())
    })
    await Promise.all(listDel)
    return Promise.resolve()
  } catch (err) {
    console.error('deleteAllProjectsTasks', err)
    return Promise.resolve()
  }
}

const getPastCharges = async (userId: string, hashtag: string | undefined) => {
  if (!hashtag) return Promise.resolve()
  const charges: Charge[] = await getStripeCharges(hashtag)
  const incomes: { [key: string]: Income } = {}
  const all: Promise<any>[] = []
  charges.forEach((charge) => {
    const dateKey = dayjs(charge.date).format('MM_YYYY')
    if (incomes[dateKey]) {
      const newAmmount = incomes[dateKey].ammount + charge.ammount
      incomes[dateKey] = {
        ammount: Math.abs(newAmmount),
        status: newAmmount >= 0 ? 'income' : 'expense',
        date: charge.date,
        stripeCharges: incomes[dateKey].stripeCharges?.concat([
          {
            id: charge.stripeId,
            ammount: charge.ammount,
            status: charge.status,
            date: charge.date,
          },
        ]),
      }
    } else {
      incomes[dateKey] = {
        ammount: charge.ammount,
        status: charge.status,
        date: charge.date,
        stripeCharges: [
          {
            id: charge.stripeId,
            ammount: charge.ammount,
            status: charge.status,
            date: charge.date,
          },
        ],
      }
    }
  })
  Object.keys(incomes).forEach((InKey: string) => {
    all.push(createProjectIncome(userId, hashtag, incomes[InKey]))
  })
  Promise.all(all).then(() => Promise.resolve())
}

const cleanPastStripe = async (userId: string, hashtag: string | undefined) => {
  if (!hashtag) return Promise.resolve()
  const res = await getAllProjectsIncomes(userId, hashtag)
  const all: Promise<any>[] = []
  res.incomes.forEach((income: Income) => {
    if (income.id && income.stripeCharges) {
      all.push(deleteProjectIncome(userId, hashtag, income.id))
    }
  })
  Promise.all(all).then(() => Promise.resolve())
}

const updateStripe = (userId: string, hashtag: string | undefined, stripeHook: string | undefined) => {
  if (!stripeHook) {
    return Promise.resolve()
  }
  if (stripeHook && !stripeHook.startsWith('rk_live')) {
    return cleanPastStripe(userId, hashtag)
  }
  return cleanPastStripe(userId, hashtag).then(() => getPastCharges(userId, hashtag))
}

const projectAdd = (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string): Promise<void> => {
  const newProj: Partial<Project> = {
    createdAt: dayjs().toISOString(),
    logo: 'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg',
  }

  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(transforms, element.name, LName.discord, LName.database)
    ;(newProj as any)[key] = transformVal(transforms, element.name, element.value, LName.discord, LName.database)
  })
  if (newProj.hashtag && /^[a-z]+$/.test(newProj.hashtag)) {
    console.error('add project', newProj)
    return Promise.all([
      openChannel(userId).then((channel) => {
        console.error('channel', channel)
        return sendChannel(
          channel.id,
          `Tu peu maintenant remplir les informations de #${newProj.hashtag} avec \`/im projet modifier hashtag: ${newProj.hashtag} website: https://google.com\` 🪴
          Mettre le site en premier permet au bot de contacter le site pour récupérer les informations pour toi.
          (Fait \`/im projet aide \` pour voir les champs disponibles)`
        )
      }),
      updateProject(userId, newProj.hashtag, newProj),
      getAllProjects(userId).then((allProj) =>
        updateUser(userId, { projects: allProj.length + 1 }).then((user) => {
          return sendTxtLater(
            `Tu as crée le projet: #${newProj.hashtag} 👏
    Tu peux voir tes projets sur ta page : ${getUserUrl(user)}/projets/${encodeURIComponent(newProj.hashtag || '')}`,
            [],
            interaction.application_id,
            interaction.token,
            interaction.channel_id
          )
        })
      ),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater(
      `Hashtag: "${newProj.hashtag}" incorect!
Le hashtag est un identifian unique qui permet d'utiliser d'autre commande du bot.
Il dois etre simple, seulement avec des lettre, sans espace sans caratères spéciaux, sans chiffres.
Exemple:
Google.com => google
INDIE MAKERS => indiemakers
`,
      [],
      interaction.application_id,
      interaction.token,
      interaction.channel_id
    )
  }
}

const projectEdit = (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string): Promise<void> => {
  const update: Partial<Project> = {
    updatedAt: dayjs().toISOString(),
  }
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(transforms, element.name, LName.discord, LName.database)
    if (!projectProtectedKey.includes(key)) {
      ;(update as any)[key] = transformVal(transforms, element.name, element.value, LName.discord, LName.database)
    }
  })
  if (update.hashtag) {
    console.error('projectEdit', update)
    return Promise.all([
      sendTxtLater(
        `Tu as mis à jour #${update.hashtag}
Bravo 💪, une marche après l'autre tu fais grandir ce projet !`,
        [],
        interaction.application_id,
        interaction.token,
        interaction.channel_id
      ),
      updateStripe(userId, update.hashtag, update.stripeApiKey),
      updateProject(userId, update.hashtag, update),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater('hashtag manquant!', [], interaction.application_id, interaction.token, interaction.channel_id)
  }
}

const projectCard = (project: Project) => {
  const fields = getFields(project, projectPublicKey, transforms)
  const name = `${project.emoji || '🪴'} ${project.name || project.hashtag}`
  const description = project.description || 'Un jour je serais grand 👶!'
  const thumb = project.logo ? image(project.logo) : undefined
  return embed(name, description, project.color, fields, undefined, undefined, project.createdAt, undefined, thumb)
}

const projectList = async (interaction: Interaction, userId: string, me = false): Promise<void> => {
  const cards: Embed[] = []
  const projects = await getAllProjects(userId)
  projects.forEach((project: Project) => {
    cards.push(projectCard(project))
  })
  console.error('project_list')
  if (cards.length > 0) {
    const sentence = me ? 'Voici la liste de tes projets !' : `Voici la liste des projets de <@${userId}> !`
    await sendTxtLater(`${sentence}\n\n`, [], interaction.application_id, interaction.token, interaction.channel_id)
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index]
      console.error('card', card)
      const result = await sendChannel(interaction.channel_id, '', card)
      if (result?.response?.headers['x-ratelimit-reset-after']) {
        const lenSize = Number(result.response.headers['x-ratelimit-reset-after']) * 1000
        console.error('Sleep a bit', lenSize)
        await sleep(lenSize)
      }
    }
    return Promise.resolve()
  } else {
    const sentence = me
      ? 'Tu n\'as pas encore de projet, ajoute en avec la commande "/im projet ajouter" !'
      : `<@${userId}> n'a pas encore de projet !`
    return sendTxtLater(sentence, [], interaction.application_id, interaction.token, interaction.channel_id)
  }
}

const projectView = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string): Promise<void> => {
  let hashtag = ''
  let makerId = userId
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (element.name === 'hashtag') {
      hashtag = element.value || ''
    } else if (element.name === 'maker') {
      makerId = element.value || ''
    }
  })
  if (hashtag) {
    const project = await getProjectById(makerId, hashtag)
    if (project) {
      console.error('projectView', hashtag, makerId)
      const text = makerId === userId ? 'Voici les infos sur ton projet !' : `Voici les infos sur le projet de <@${makerId}> !`
      return sendTxtLater(`${text}\n`, [projectCard(project)], interaction.application_id, interaction.token, interaction.channel_id)
    } else {
      console.error('projectView', hashtag, makerId)
      return sendTxtLater(
        `Je ne trouve pas le projet ${hashtag} pour <@${makerId}>...`,
        [],
        interaction.application_id,
        interaction.token,
        interaction.channel_id
      )
    }
  } else {
    return sendTxtLater('Donne moi un projet !', [], interaction.application_id, interaction.token, interaction.channel_id)
  }
}

const projectDelete = (interaction: Interaction, option: ApplicationCommandInteractionDataOption, userId: string): Promise<void> => {
  const hashtag = option.value
  if (hashtag) {
    console.error('projectDelete', hashtag)
    return Promise.all([
      deleteProject(userId, hashtag),
      deleteAllProjectsTasks(userId, hashtag),
      sendTxtLater(
        `Tu as supprimé ton projet ${hashtag} et ses taches 🚮!
Savoir terminer un projet est une force!`,
        [],
        interaction.application_id,
        interaction.token,
        interaction.channel_id
      ),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater('Donne moi un projet !', [], interaction.application_id, interaction.token, interaction.channel_id)
  }
}

export const projectFn = (interaction: Interaction, option: ApplicationCommandInteractionDataOption, userId: string): Promise<void> => {
  if (option.name === 'ajouter' && option.options && option.options.length > 0) {
    return projectAdd(interaction, option.options, userId)
  }
  if (option.name === 'modifier' && option.options && option.options.length > 0) {
    return projectEdit(interaction, option.options, userId)
  }
  if (option.name === 'liste' && option.options && option.options.length > 0 && option.options[0].value) {
    return projectList(interaction, option.options[0].value)
  }
  if (option.name === 'liste') {
    return projectList(interaction, userId, true)
  }
  if (option.name === 'voir' && option.options && option.options.length > 0 && option.options[0].value) {
    return projectView(interaction, option.options, userId)
  }
  if (option.name === 'supprimer' && option.options && option.options.length > 0) {
    return projectDelete(interaction, option.options[0], userId)
  }
  if (option.name === 'aide') {
    return sendTxtLater(
      `Voici ce que tu peux faire avec la commande projet:
  - **ajouter**
    - hashtag: obligatoire (pas d'espace sans majuscules)
  - **modifier**
    - hashtag: obligatoire
    - open_source: optionel
      - Oui
      - Non
    - github: optionnel (url complète nécessaire)
    - emoji: optionnel (un seul caractère)
    - couleur: optionnel en hexadecimal sans \`#\` au début
    - nom: optionnel (Nom avec espace possible)
    - logo: optionnel (url complete necessaire)
    - cover: optionnel (url complete necessaire)
    - website: optionnel (url complete necessaire)
    - description: optionnel (texte cours)
    - category: optionnel
      - saas
      - community
      - newsletter
      - formation
      - template
      - ecommerce
      - Autre
    - stripe: optionnel permet de récupérer les revenues en automatique (voir la doc pour comprendre comment l'obtenir)
  - **supprimer** (supprimer un de tes projets)
    - hashtag: obligatoire
  - **voir** (voir un projet d'un Maker ou toi par défaut)
      - hashtag: obligatoire
      - maker: optionnel
  - **liste** (lister les projets d'un Maker ou toi par défaut)
    - Hashtag: obligatoire
  `,
      [],
      interaction.application_id,
      interaction.token,
      interaction.channel_id
    )
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token,
    interaction.channel_id
  )
}
