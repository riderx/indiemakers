import dayjs from 'dayjs'
import admin from 'firebase-admin'
import {
  Interaction,
  ApplicationCommandInteractionDataOption,
} from '../command'
import { getStripeCharges, Charge } from './stripe'
import {
  Embed,
  embed,
  field,
  getConfig,
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
} from './utils'
import { getUserUrl, updateUser, User } from './user'
import {
  createProjectIncome,
  deleteProjectIncome,
  getAllProjectsIncomes,
  Income,
} from './incomes'
import { Task } from './tasks'
// eslint-disable-next-line no-unused-vars
enum Category {
  // eslint-disable-next-line no-unused-vars
  SAAS = 'saas',
  // eslint-disable-next-line no-unused-vars
  COMMUNITY = 'community',
  // eslint-disable-next-line no-unused-vars
  NEWSLETTER = 'newsletter',
  // eslint-disable-next-line no-unused-vars
  FORMATION = 'formation',
  // eslint-disable-next-line no-unused-vars
  TEMPLATE = 'template',
  // eslint-disable-next-line no-unused-vars
  ECOMMERCE = 'ecommerce',
  // eslint-disable-next-line no-unused-vars
  OTHER = 'other',
}
export interface Project {
  id?: string
  userId?: string
  userName?: string
  lastTaskAt?: string
  launchedAt?: string
  createdAt: string
  updatedAt: string
  hashtag: string
  tasks: number
  incomes: number
  tasksData?: Task[]
  incomesData?: Income[]
  openSource?: boolean
  github?: string
  twitter?: string
  streak: number
  bestStreak: number
  emoji: string
  color: string
  name: string
  logo: string
  cover: string
  description: string
  category: Category
  website: string
  stripeApiKey?: string
}
const projectPublicKey = [
  'hashtag',
  'name',
  'category',
  'emoji',
  'color',
  'cover',
  'github',
  'openSource',
  'website',
  'tasks',
  'streak',
]
const projectProtectedKey = [
  'id',
  'tasks',
  'streak',
  'bestStreak',
  'createdAt',
  'updatedAt',
  'lastTaskAt',
]

const transforms: Langs[] = [
  t9r('color', 'couleur', 'Couleur'),
  t9r('name', 'nom', 'Nom'),
  t9r('cover', 'couverture', 'Couverture'),
  t9r('year', 'année', 'Année'),
  t9r('month', 'mois', 'Mois'),
  t9r('category', 'categorie', 'Categorie'),
  t9r('openSource', 'open_source', 'Open source'),
  t9r('website', 'website', 'Site web', undefined, false),
  t9r('github', 'github', 'Github', undefined, false),
  t9r('twitter', 'twitter', 'Twitter', undefined, false),
  t9r('emoji', 'emoji', 'Emoji'),
  t9r('hashtag', 'hashtag', '#️⃣'),
]

export const getAllProjects = async (userId: string): Promise<Project[]> => {
  try {
    const documents = await admin
      .firestore()
      .collection(`discord/${userId}/projects`)
      .get()

    const projects: Project[] = []
    for (let index = 0; index < documents.docs.length; index++) {
      const doc = documents.docs[index]
      const data = (await doc.data()) as Project
      if (data !== undefined) {
        projects.push({ userId, id: doc.id, ...(data as Project) })
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
      return getAllProjects(String(usr?.userId))
    })
  )
  const projects: Project[] = arrays.reduce((a, b) => a.concat(b), [])
  return projects
}

export const getProjectById = async (
  userId: string,
  hashtag: string
): Promise<Project | null> => {
  try {
    const res = await admin
      .firestore()
      .collection(`discord/${userId}/projects`)
      .doc(hashtag.toLowerCase())
      .get()
    const data = res.data()
    return data !== undefined ? (data as Project) : null
  } catch (err) {
    console.error('getProjectById', err)
    return null
  }
}

export const updateProject = async (
  userId: string,
  hashtag: string,
  project: Partial<Project>
): Promise<Project> => {
  const lowHash = hashtag.toLowerCase()
  const projDoc = await admin
    .firestore()
    .collection(`discord/${userId}/projects`)
    .doc(lowHash)
    .get()
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
    await admin
      .firestore()
      .collection(`discord/${userId}/projects`)
      .doc(lowHash)
      .set(newProject)
    return newProject
  }
  const data: Project = projDoc.data() as Project
  if (!data.name && project.name) {
    await openChannel(userId).then((channel) => {
      console.error('channel', channel)
      return sendChannel(
        channel.id,
        `💗 Il est temps d'envoyer 💌 ta première tâche au projet #${lowHash} avec:
\`/im tache ajouter hashtag:${lowHash} contenu:Ajout du projet sur INDIE MAKERS\`
  Fait le sur le salon #01_construire_en_public, il est fait pour ça, il est en silencieux pour tout le monde !`
      )
    })
  }
  await projDoc.ref.update({ ...project, updatedAt: dayjs().toISOString() })
  return projDoc.data() as Project
}

export const addProject = async (
  interaction: Interaction,
  userId: string,
  newProj: Project
): Promise<any> => {
  const all: Promise<any>[] = []

  await updateProject(userId, newProj.hashtag, newProj)
  const allProj = await getAllProjects(userId)
  const user = await updateUser(userId, { projects: allProj.length })
  if (allProj.length === 1) {
    all.push(
      openChannel(userId).then((channel) => {
        console.error('channel', channel)
        return sendChannel(
          channel.id,
          `Ton premiers projet 🪴 !
Tu peu maintenant remplir les informations de #${newProj.hashtag} avec:
  \`/im projet modifier hashtag:${newProj.hashtag} nom:Mon super projet\`
, fait:
  \`/im projet aide\`
pour voir les champs disponibles.
Fait le sur le salon #01_construire_en_public .`
        )
      })
    )
    const data = await getConfig()
    if (data) {
      all.push(
        sendChannel(
          data.channel_general,
          `Hey Makers, Donnez de la force 💪🏋️‍♂️ a <@${userId}>
  il viens de crée son premier projet !`
        )
      )
    }
  } else {
    all.push(
      openChannel(userId).then((channel) => {
        console.error('channel', channel)
        return sendChannel(
          channel.id,
          `Rempli les informations de #${newProj.hashtag} 🪴 avec:
  \`/im projet modifier hashtag:${newProj.hashtag} nom:Mon super projet\`
, fait:
  \`/im projet aide \`
pour voir les champs disponibles.
Fait le sur le salon #01_construire_en_public .`
        )
      })
    )
  }
  all.push(
    sendTxtLater(
      `Tu as crée le projet: #${newProj.hashtag} 👏
Tu peux voir tes projets sur ta page : ${getUserUrl(user)}`,
      [],
      interaction.application_id,
      interaction.token
    )
  )
  return Promise.all(all)
}

const deleteProject = (userId: string, hashtag: string): Promise<any> => {
  return admin
    .firestore()
    .collection(`discord/${userId}/projects`)
    .doc(hashtag.toLowerCase())
    .delete()
}

export const deleteAllProjectsTasks = async (
  userId: string,
  hashtag: string
): Promise<void> => {
  try {
    const documents = await admin
      .firestore()
      .collection(`discord/${userId}/projects/${hashtag}/tasks`)
      .get()
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
  res.incomes.forEach((income) => {
    if (income.id && income.stripeCharges) {
      all.push(deleteProjectIncome(userId, hashtag, income.id))
    }
  })
  Promise.all(all).then(() => Promise.resolve())
}

const updateStripe = (
  userId: string,
  hashtag: string | undefined,
  stripeHook: string | undefined
) => {
  if (!stripeHook) {
    return Promise.resolve()
  }
  if (stripeHook && !stripeHook.startsWith('rk_live')) {
    return cleanPastStripe(userId, hashtag)
  }
  return cleanPastStripe(userId, hashtag).then(() =>
    getPastCharges(userId, hashtag)
  )
}

const projectAdd = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  const newProj: Partial<Project> = {
    createdAt: dayjs().toISOString(),
    logo: 'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg',
  }

  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(
      transforms,
      element.name,
      LName.discord,
      LName.database
    )
    ;(newProj as any)[key] = transformVal(
      transforms,
      element.name,
      element.value,
      LName.discord,
      LName.database
    )
  })
  if (newProj.hashtag && /^[a-z]+$/.test(newProj.hashtag)) {
    console.error('add project', newProj)
    return Promise.all([
      openChannel(userId).then((channel) => {
        console.error('channel', channel)
        return sendChannel(
          channel.id,
          `Tu peu maintenant remplir les informations de #${newProj.hashtag} avec \`/im projet modifier hashtag: ${newProj.hashtag} nom: Mon super projet\` 🪴
          (Fait \`/im projet aide \` pour voir les champs disponibles)`
        )
      }),
      updateProject(userId, newProj.hashtag, newProj),
      getAllProjects(userId).then((allProj) =>
        updateUser(userId, { projects: allProj.length + 1 }).then((user) => {
          return sendTxtLater(
            `Tu as crée le projet: #${newProj.hashtag} 👏
    Tu peux voir tes projets sur ta page : ${getUserUrl(user)}`,
            [],
            interaction.application_id,
            interaction.token
          )
        })
      ),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater(
      'hashtag manquant ou incorect!',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const projectEdit = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  const update: Partial<Project> = {
    updatedAt: dayjs().toISOString(),
  }
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(
      transforms,
      element.name,
      LName.discord,
      LName.database
    )
    if (!projectProtectedKey.includes(key)) {
      ;(update as any)[key] = transformVal(
        transforms,
        element.name,
        element.value,
        LName.discord,
        LName.database
      )
    }
  })
  if (update.hashtag) {
    console.error('projectEdit', update)
    return Promise.all([
      sendTxtLater(
        `Tu a mis à jour #${update.hashtag}
Bravo 💪, une marche après l'autre tu fais grandir ce projet !`,
        [],
        interaction.application_id,
        interaction.token
      ),
      updateStripe(userId, update.hashtag, update.stripeApiKey),
      updateProject(userId, update.hashtag, update),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater(
      'hashtag manquant!',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const projectCard = (project: Project) => {
  const fields = getFields(project, projectPublicKey, transforms)
  const name = `${project.emoji || '🪴'} ${project.name || project.hashtag}`
  const description = project.description || 'Un jour je serais grand 👶!'
  const thumb = project.logo ? image(project.logo) : undefined
  return embed(
    name,
    description,
    project.color,
    fields,
    undefined,
    undefined,
    project.createdAt,
    undefined,
    thumb
  )
}

const projectList = async (
  interaction: Interaction,
  userId: string,
  me = false
): Promise<void> => {
  const cards: Embed[] = []
  const projects = await getAllProjects(userId)
  projects.forEach((project: Project) => {
    cards.push(projectCard(project))
  })
  console.error('project_list')
  if (cards.length > 0) {
    const sentence = me
      ? 'Voici la liste de tes projets !'
      : `Voici la liste des projets de <@${userId}> !`
    await sendTxtLater(
      `${sentence}\n\n`,
      [],
      interaction.application_id,
      interaction.token
    )
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index]
      console.error('card', card)
      const result = await sendChannel(interaction.channel_id, '', card)
      if (result?.response?.headers['x-ratelimit-reset-after']) {
        const lenSize =
          Number(result.response.headers['x-ratelimit-reset-after']) * 1000
        console.error('Sleep a bit', lenSize)
        await sleep(lenSize)
      }
    }
    return Promise.resolve()
  } else {
    const sentence = me
      ? 'Tu n\'as pas encore de projet, ajoute en avec la commande "/im projet ajouter" !'
      : `<@${userId}> n'a pas encore de projet !`
    return sendTxtLater(
      sentence,
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const projectView = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
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
      const text =
        makerId === userId
          ? 'Voici les infos sur ton projet !'
          : `Voici les infos sur le projet de <@${makerId}> !`
      return sendTxtLater(
        `${text}\n`,
        [projectCard(project)],
        interaction.application_id,
        interaction.token
      )
    } else {
      console.error('projectView', hashtag, makerId)
      return sendTxtLater(
        `Je ne trouve pas le projet ${hashtag} pour <@${makerId}>...`,
        [],
        interaction.application_id,
        interaction.token
      )
    }
  } else {
    return sendTxtLater(
      'Donne moi un projet !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const projectDelete = (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  userId: string
): Promise<void> => {
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
        interaction.token
      ),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater(
      'Donne moi un projet !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

export const projectFn = (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  userId: string
): Promise<void> => {
  if (
    option.name === 'ajouter' &&
    option.options &&
    option.options.length > 0
  ) {
    return projectAdd(interaction, option.options, userId)
  }
  if (
    option.name === 'modifier' &&
    option.options &&
    option.options.length > 0
  ) {
    return projectEdit(interaction, option.options, userId)
  }
  if (
    option.name === 'liste' &&
    option.options &&
    option.options.length > 0 &&
    option.options[0].value
  ) {
    return projectList(interaction, option.options[0].value)
  }
  if (option.name === 'liste') {
    return projectList(interaction, userId, true)
  }
  if (
    option.name === 'voir' &&
    option.options &&
    option.options.length > 0 &&
    option.options[0].value
  ) {
    return projectView(interaction, option.options, userId)
  }
  if (
    option.name === 'supprimer' &&
    option.options &&
    option.options.length > 0
  ) {
    return projectDelete(interaction, option.options[0], userId)
  }
  if (option.name === 'aide') {
    return sendTxtLater(
      `Voici ce que tu peux faire avec la commande projet:
  - ajouter
    - hashtag: obligatoire (pas d'espace sans majuscules)
  - modifier
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
  - supprimer (supprimer un de tes projets)
    - hashtag: obligatoire
  - voir (voir un projet d'un Maker ou toi par défaut)
      - hashtag: obligatoire
      - maker: optionnel
  - liste (lister les projets d'un Maker ou toi par défaut)
    - Hashtag: obligatoire
  `,
      [],
      interaction.application_id,
      interaction.token
    )
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token
  )
}
