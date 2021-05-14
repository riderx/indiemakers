import { firestore } from 'firebase-admin'
import dayjs from 'dayjs'
import {
  Interaction,
  ApplicationCommandInteractionDataOption,
} from '../command'
import { getStripeCharges, Charge } from './stripe'
import { embed, field, image, sendChannel, sendTxtLater } from './utils'
import { updateUser } from './user'
import {
  createProjectIncome,
  deleteProjectIncome,
  getAllProjectsIncomes,
  Income,
} from './income'
import { Task } from './tasks'

export interface Project {
  id?: string
  lastTaskAt?: string
  createdAt: string
  updatedAt: string
  hashtag: string
  tasks: number
  tasksData?: Task[]
  IncomeData?: Income[]
  streak: number
  emoji: string
  color: string
  name: string
  logo: string
  description: string
  category: string
  website: string
  stripeKey?: string
}
// const projectPublicKey = ["hashtag", "name", "description", "logo", "emoji", "color", "taches", "flammes", "website"];
const projectProtectedKey = [
  'id',
  'tasks',
  'streak',
  'createdAt',
  'updatedAt',
  'lastTaskAt',
]

const transformKey = (key: string): string => {
  switch (key) {
    case 'nom':
      return 'name'
    case 'couleur':
      return 'color'
    case 'categorie':
      return 'category'
    case 'stripe_key':
      return 'stripeKey'
    default:
      return key
  }
}

export const getAllProjects = async (userId: string): Promise<Project[]> => {
  try {
    const documents = await firestore()
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
    const res = await firestore()
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
): Promise<firestore.WriteResult> => {
  const userDoc = await firestore()
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
        emoji: '',
        color: '',
        tasks: 0,
        streak: 0,
        updatedAt: dayjs().toISOString(),
        createdAt: dayjs().toISOString(),
      },
      project
    )
    return firestore()
      .collection(`discord/${userId}/projects`)
      .doc(hashtag)
      .set(newProject)
  }
  return userDoc.ref.update({ ...project, updatedAt: dayjs().toISOString() })
}

const deleteProject = (
  userId: string,
  projectId: string
): Promise<firestore.WriteResult> => {
  return firestore()
    .collection(`discord/${userId}/projects`)
    .doc(projectId)
    .delete()
}

export const deleteAllProjectsTasks = async (
  userId: string,
  projectId: string
): Promise<void> => {
  try {
    const documents = await firestore()
      .collection(`discord/${userId}/projects/${projectId}/tasks`)
      .get()
    const listDel: Promise<firestore.WriteResult>[] = []
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

const addStripe = (
  userId: string,
  projectId: string | undefined,
  stripeHook: string | undefined
) => {
  if (!stripeHook) {
    return Promise.resolve()
  }
  return getPastCharges(userId, projectId)
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
    ;(newProj as any)[transformKey(element.name)] = element.value
  })
  if (newProj.hashtag && /^[a-zA-Z]+$/.test(newProj.hashtag)) {
    console.log('add project', newProj)
    return Promise.all([
      sendTxtLater(
        `Tu as crée le projet:\n#${newProj.hashtag} 👏\nIl est temps de shiper ta premiere tache dessus avec \`/im tache\` ou remplir sa description avec \`/im projet modifier description: \`  💪!`,
        [],
        interaction.application_id,
        interaction.token
      ),
      addStripe(userId, newProj.hashtag, newProj.stripeKey),
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
    if (!projectProtectedKey.includes(transformKey(element.name))) {
      ;(update as any)[transformKey(element.name)] = element.value
    }
  })
  if (update.hashtag) {
    console.log('projectEdit', update)
    return Promise.all([
      sendTxtLater(
        `Tu as mis a jours le projet:\n#${update.hashtag}\nBravo 💪, une marche après l'autre tu fais grandir ce projet!`,
        [],
        interaction.application_id,
        interaction.token
      ),
      updateStripe(userId, update.hashtag, update.stripeKey),
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

const projectList = async (
  interaction: Interaction,
  userId: string,
  me = false
): Promise<void> => {
  const cards: Promise<any>[] = []
  const projects = await getAllProjects(userId)
  projects.forEach((project: Project) => {
    const fields = [
      field('🔥 Flammes', String(project.streak)),
      field('💗 Taches', String(project.tasks)),
    ]
    if (project.website) {
      fields.push(field('Website', String(project.website), false))
    }
    const name = `${project.emoji || '🌱'} ${project.name || project.hashtag}`
    const description =
      project.description ||
      "Je n'ai pas encore de description, je suis jeune 👶!"
    const thumb = project.logo ? image(project.logo) : undefined
    const projCard = embed(
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
    cards.push(sendChannel(interaction.channel_id, '', projCard))
  })
  console.error('project_list')
  const sentence = me
    ? 'Voici la liste de tes projets !'
    : `Voici la liste des projets de <@${userId}> !`
  return Promise.all([
    sendTxtLater(
      `${sentence}\n\n`,
      [],
      interaction.application_id,
      interaction.token
    ),
    ...cards,
  ]).then(() => Promise.resolve())
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
      const fields = [
        field('🔥 Flammes', String(project.streak)),
        field('💗 Taches', String(project.tasks)),
      ]
      if (project.website) {
        fields.push(field('Website', String(project.website), false))
      }
      const name = `${project.emoji || '🌱'} ${project.name || project.hashtag}`
      const description =
        project.description ||
        "Je n'ai pas encore de description, je suis jeune 👶!"
      const thumb = project.logo ? image(project.logo) : undefined
      const projCard = embed(
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
      console.log('projectView', projectId, makerId)
      const text =
        makerId === userId
          ? 'Voici les infos sur ton projet !'
          : `Voici les infos sur le projet de <@${userId}> !`
      return sendTxtLater(
        `${text}\n`,
        [projCard],
        interaction.application_id,
        interaction.token
      )
    } else {
      console.log('projectView', projectId, makerId)
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
    console.log('projectDelete', projectId)
    return Promise.all([
      deleteProject(userId, projectId),
      deleteAllProjectsTasks(userId, projectId),
      sendTxtLater(
        `Tu as supprimé ton projet ${projectId} et ses taches !\nSavoir terminer un projet est une force!`,
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
    `La Commande ${option.name} n'est pas pris en charge`,
    [],
    interaction.application_id,
    interaction.token
  )
}
