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
  getFields,
  image,
  sendChannel,
  sendTxtLater,
  sleep,
  transformKey,
} from './utils'
import { updateUser } from './user'
import {
  createProjectIncome,
  deleteProjectIncome,
  getAllProjectsIncomes,
  Income,
} from './incomes'
import { Task } from './tasks'

export interface Project {
  id?: string
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
  streak: number
  emoji: string
  color: string
  name: string
  logo: string
  cover: string
  description: string
  category: string
  website: string
  stripeApiKey?: string
}
const projectPublicKey = [
  'hashtag',
  'name',
  'description',
  'category',
  'emoji',
  'color',
  'cover',
  'github',
  'openSource',
  'tasks',
  'streak',
]
const projectProtectedKey = [
  'id',
  'tasks',
  'streak',
  'createdAt',
  'updatedAt',
  'lastTaskAt',
]

const translations = {
  couleur: 'color',
  nom: 'name',
  couverture: 'cover',
  categorie: 'category',
  stripe: 'stripeApiKey',
  open_source: 'openSource',
}

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
        projects.push({ id: doc.id, ...(data as Project) })
      }
    }
    return projects
  } catch (err) {
    console.error('getAllProjects', err)
    return []
  }
}

export const getProjectById = async (
  userId: string,
  projectId: string
): Promise<Project | null> => {
  try {
    const res = await admin
      .firestore()
      .collection(`discord/${userId}/projects`)
      .doc(projectId)
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
): Promise<any> => {
  const userDoc = await admin
    .firestore()
    .collection(`discord/${userId}/projects`)
    .doc(hashtag)
    .get()
  if (!userDoc.exists || !userDoc.data) {
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
        incomes: 0,
        updatedAt: dayjs().toISOString(),
        createdAt: dayjs().toISOString(),
      },
      project
    )
    return admin
      .firestore()
      .collection(`discord/${userId}/projects`)
      .doc(hashtag)
      .set(newProject)
  }
  return userDoc.ref.update({ ...project, updatedAt: dayjs().toISOString() })
}

const deleteProject = (userId: string, projectId: string): Promise<any> => {
  return admin
    .firestore()
    .collection(`discord/${userId}/projects`)
    .doc(projectId)
    .delete()
}

export const deleteAllProjectsTasks = async (
  userId: string,
  projectId: string
): Promise<void> => {
  try {
    const documents = await admin
      .firestore()
      .collection(`discord/${userId}/projects/${projectId}/tasks`)
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

const getPastCharges = async (
  userId: string,
  projectId: string | undefined
) => {
  if (!projectId) return Promise.resolve()
  const charges: Charge[] = await getStripeCharges(projectId)
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
    all.push(createProjectIncome(userId, projectId, incomes[InKey]))
  })
  Promise.all(all).then(() => Promise.resolve())
}

const cleanPastStripe = async (
  userId: string,
  projectId: string | undefined
) => {
  if (!projectId) return Promise.resolve()
  const res = await getAllProjectsIncomes(userId, projectId)
  const all: Promise<any>[] = []
  res.incomes.forEach((income) => {
    if (income.id && income.stripeCharges) {
      all.push(deleteProjectIncome(userId, projectId, income.id))
    }
  })
  Promise.all(all).then(() => Promise.resolve())
}

const updateStripe = (
  userId: string,
  projectId: string | undefined,
  stripeHook: string | undefined
) => {
  if (!stripeHook) {
    return Promise.resolve()
  }
  if (stripeHook && !stripeHook.startsWith('rk_live')) {
    return cleanPastStripe(userId, projectId)
  }
  return cleanPastStripe(userId, projectId).then(() =>
    getPastCharges(userId, projectId)
  )
}

const projectAdd = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  const newProj: Partial<Project> = {
    createdAt: dayjs().toISOString(),
  }

  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    ;(newProj as any)[transformKey(translations, element.name)] = element.value
  })
  if (newProj.hashtag && /^[a-zA-Z]+$/.test(newProj.hashtag)) {
    console.error('add project', newProj)
    return Promise.all([
      sendTxtLater(
        `Tu as crée le projet: #${newProj.hashtag} 👏

        Il est temps de shiper 🚤 ta premiere tache dessus avec \`/im tache hashtag: ${newProj.hashtag} contenue: Ma super tache\` 💗
        ou
        remplir sa description avec \`/im projet hashtag: ${newProj.hashtag} modifier description: mon super projet\` 🪴
        ou
        enregistrer un premier revenue avec \`/im revenue ajouter hashtag: ${newProj.hashtag} revenue 42 mois: Février 2021 \`💰!`,
        [],
        interaction.application_id,
        interaction.token
      ),
      updateProject(userId, newProj.hashtag, newProj),
      getAllProjects(userId).then((allProj) =>
        updateUser(userId, { projects: allProj.length + 1 })
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
    const key = transformKey(translations, element.name)
    if (!projectProtectedKey.includes(key)) {
      ;(update as any)[key] = element.value
    }
  })
  if (update.hashtag) {
    console.error('projectEdit', update)
    return Promise.all([
      sendTxtLater(
        `Tu as mis a jour:\n#${update.hashtag}
        Bravo 💪, une marche après l'autre tu fais grandir ce projet!`,
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
  const fields = getFields(project, projectPublicKey, translations)
  const name = `${project.emoji || '🪴'} ${project.name || project.hashtag}`
  const description = project.description || 'Un jour je serais grand 👶!'
  const thumb = project.logo ? image(project.logo) : undefined
  if (project.website) {
    fields.push(
      field(transformKey(translations, 'website', true), project.website, false)
    )
  }
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
      : `<@${userId}> n'as pas encore de projet !`
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
  let projectId = ''
  let makerId = userId
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (element.name === 'hashtag') {
      projectId = element.value || ''
    } else if (element.name === 'maker') {
      makerId = element.value || ''
    }
  })
  if (projectId) {
    const project = await getProjectById(makerId, projectId)
    if (project) {
      console.error('projectView', projectId, makerId)
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
      console.error('projectView', projectId, makerId)
      return sendTxtLater(
        `Je ne trouve pas le projet ${projectId} pour <@${makerId}>...`,
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
  const projectId = option.value
  if (projectId) {
    console.error('projectDelete', projectId)
    return Promise.all([
      deleteProject(userId, projectId),
      deleteAllProjectsTasks(userId, projectId),
      sendTxtLater(
        `Tu as supprimé ton projet ${projectId} et ses taches 🚮!
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
  if (option.name === 'creer' && option.options && option.options.length > 0) {
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
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token
  )
}
