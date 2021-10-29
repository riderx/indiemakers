import dayjs from 'dayjs'
import { Mutex } from 'await-semaphore'
import { Interaction, ApplicationCommandInteractionDataOption } from '../command'
import { initTranslate, frToEn } from '../translate'
import { Project, Task, TaskStatus, User } from '../../../services/types'
import { getConfig, getUsersById, updateUser } from '../../../services/firebase/discord'
import {
  addTask,
  getTask,
  getLastTask,
  getOneProjectsTaskDoc,
  getAllProjectsTasks,
  deleteProjectTask,
} from '../../../services/firebase/tasks'
import { Langs, lastDay, LName, openChannel, sendChannel, sendTxtLater, t9r, transformKey, transformVal } from './utils'
import { sendToWip, updateToWip } from './wip'
import { sendToMakerlog } from './makerlog'
import { getAllProjects, getProjectById, updateProject } from './project'

const projectSem: { [key: string]: Mutex } = {}

const taskPublicKey = ['id', 'content', 'status', 'doneAt', 'createdAt']
const taskProtectedKey = ['id', 'wipId', 'makerlogHook', 'createdAt', 'doneAt', 'updatedAt']
const statusToText = (status: TaskStatus) => {
  return status === TaskStatus.DONE ? 'Fait' : 'A faire'
}

const createProjectTask = async (applicationId: string, token: string, user: User, hashtag: string, task: Partial<Task>): Promise<any> => {
  if (!projectSem[`$[user.userId}_${hashtag.toLowerCase()}`]) {
    projectSem[`$[user.userId}_${hashtag.toLowerCase()}`] = new Mutex()
  }
  const release = await projectSem[`$[user.userId}_${hashtag.toLowerCase()}`].acquire()
  try {
    const projDoc = await getTask(user.userId, hashtag)
    if (!projDoc.exists) {
      return sendTxtLater(
        `Le projet #${hashtag.toLowerCase()}, n'existe pas. tu peux le crée avec \`/im projet ajouter\` 😇`,
        [],
        applicationId,
        token
      )
    }
    if (!task.content) {
      return sendTxtLater(`La tache n'as pas de contenue 😇`, [], applicationId, token)
    }
    const done = task.status !== TaskStatus.TODO
    const lastTask = await getLastTask(user.userId, hashtag)
    if (lastTask) {
      task.id = Number(lastTask.id) + 1
    } else {
      task.id = 0
    }
    if (task.status === TaskStatus.DONE) {
      task.doneAt = dayjs().toISOString()
    }
    try {
      const taskWithHashtag = user?.autoTranslate
        ? `${await frToEn(initTranslate(), task.content)} #${hashtag.toLowerCase()}`
        : `${task.content} #${hashtag.toLowerCase()}`
      if (user?.makerlogHook && task?.content) {
        task.makerlogHook = await sendToMakerlog(user.makerlogHook, taskWithHashtag, done)
      }
      if (user?.wipApiKey && task?.content) {
        task.wipId = await sendToWip(user.wipApiKey, taskWithHashtag, done)
      }
    } catch (err) {
      console.error('Cannot send to third party', err)
    }
    await sendTxtLater(
      `La tache 💗 ${task.id}:
${task.content}
A été ajouté au projet #${hashtag} 🎉!`,
      [],
      applicationId,
      token
    )
    const newTask = await addTask(user.userId, hashtag, { ...task, createdAt: dayjs().toISOString() })
    release()
    const curProject = await getProjectById(user.userId, hashtag)
    await updateProjectTaskAndStreak(user.userId, curProject)
    await updateUserTaskAndStreak(user)
    return newTask.get()
  } catch (err) {
    console.error('createProjectTask', err)
    release()
    return Promise.reject(err)
  }
}

const updateProjectTask = async (userId: string, hashtag: string, taskId: string, task: Partial<Task>): Promise<any> => {
  try {
    const curTaskDoc = await getOneProjectsTaskDoc(userId, hashtag, taskId)
    if (!curTaskDoc || !curTaskDoc?.exists) {
      return null
    }
    const curTask = curTaskDoc.data() as Task
    const user = await getUsersById(userId)
    const done = task.status ? task.status !== TaskStatus.TODO : true
    if (task.status && task.status === TaskStatus.DONE) {
      task.doneAt = dayjs().toISOString()
    }
    try {
      const taskWithHashtag = user?.autoTranslate
        ? `${await frToEn(initTranslate(), task.content || curTask.content)} #${hashtag.toLowerCase()}`
        : `${task.content} #${hashtag.toLowerCase()}`
      if (task?.makerlogHook && task?.content) {
        task.makerlogHook = await sendToMakerlog(task.makerlogHook, taskWithHashtag, done)
      }
      if (user?.wipApiKey && task?.wipId && task?.content) {
        task.wipId = await updateToWip(user.wipApiKey, task.wipId, taskWithHashtag, done)
      }
    } catch (err) {
      console.error('Cannot send to third party', err)
    }
    curTaskDoc.ref.update({ ...task, updatedAt: dayjs().toISOString() })
    return curTask
  } catch (err) {
    console.error('updateProjectTask', err)
    return null
  }
}

const transforms: Langs[] = [t9r('content', 'contenu', 'Contenu')]

export const resetProjectStreak = (userId: string | undefined, proj: Project) => {
  const lastTaskAt = dayjs(proj.lastTaskAt)
  if (userId && (!proj.lastTaskAt || lastTaskAt.isBefore(lastDay()))) {
    try {
      const bestStreak = proj.bestStreak && proj.bestStreak > proj.streak ? proj.bestStreak : proj.streak
      return updateProject(userId, proj.hashtag, { streak: 0, bestStreak })
    } catch (err) {
      console.error(err)
    }
    return proj
  } else {
    return proj
  }
}

const updateProjectTaskAndStreak = async (userId: string, proj: Project | null) => {
  if (!proj) return Promise.reject(Error('Projet introuvable'))
  const lowHash = proj.hashtag.toLowerCase()
  const curTasks = await getAllProjectsTasks(userId, lowHash)
  // enregistrer un premier revenu avec \`/im revenu ajouter hashtag: ${newProj.hashtag} revenu 42 mois: Février 2021 \`💰!
  if (curTasks.total === 1) {
    const config = await getConfig()
    const channel = await openChannel(userId)
    console.error('channel', channel)
    return sendChannel(
      channel.id,
      `Il est temps d'enregistrer un premier revenu 💰 ou dépense 💸 sur #${lowHash} avec:
\`/im revenu ajouter hashtag:${lowHash} montant:-300 mois:Janvier année:2021 \`
💪 Fait le sur le salon <#${config.channel_bip}> .`
    )
  }
  const updatedProject: Partial<Project> = {
    tasks: curTasks.total,
    lastTaskAt: dayjs().toISOString(),
  }
  const lastTaskAt = dayjs(proj.lastTaskAt)
  if (proj.lastTaskAt && lastTaskAt.isAfter(lastDay())) {
    updatedProject.streak = (proj.streak || 0) + 1
  } else {
    updatedProject.streak = 1
  }
  return updateProject(userId, proj.hashtag, updatedProject)
}

export const resetUserStreak = async (usr: User) => {
  const lastTaskAt = dayjs(usr.lastTaskAt)
  if (!usr.lastTaskAt || lastTaskAt.isBefore(lastDay())) {
    try {
      const bestStreak = usr.bestStreak && usr.bestStreak > usr.streak ? usr.bestStreak : usr.streak
      return await updateUser(usr.userId, { streak: 0, bestStreak })
    } catch (err) {
      console.error(err)
    }
    return usr
  } else {
    return usr
  }
}

export const updateUserTaskAndStreak = async (usr: User) => {
  const superTotal = await getTotalTaskAndStreakByUser(usr.userId)
  const updatedUser: Partial<User> = {
    tasks: superTotal.tasks,
    lastTaskAt: dayjs().toISOString(),
  }
  const lastTaskAt = dayjs(usr.lastTaskAt)
  if (usr.lastTaskAt && lastTaskAt.isAfter(lastDay())) {
    updatedUser.streak = (usr.streak || 0) + 1
  } else {
    updatedUser.streak = 1
  }
  return updateUser(usr.userId, updatedUser)
}

const taskAdd = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string): Promise<void> => {
  let hashtag = ''
  const task: Partial<Task> = {
    status: TaskStatus.DONE,
  }
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(transforms, element.name, LName.discord, LName.database)
    if (element.name === 'hashtag' && element.value) {
      hashtag = element.value
    } else if (taskPublicKey.includes(key)) {
      ;(task as any)[key] = transformVal(transforms, element.name, element.value, LName.discord, LName.database)
    }
  })
  const curUser = await getUsersById(userId)
  if (curUser) {
    return createProjectTask(interaction.application_id, interaction.token, curUser, hashtag, task).then(() => Promise.resolve())
  } else {
    return sendTxtLater('Le Maker ou le projet est introuvable 🤫!', [], interaction.application_id, interaction.token)
  }
}

const taskEdit = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string): Promise<void> => {
  let hashtag = ''
  const task: Partial<Task> = {}
  let taskId = ''

  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(transforms, element.name, LName.discord, LName.database)
    if (element.name === 'hashtag' && element.value) {
      hashtag = element.value
    } else if (element.name === 'id' && element.value) {
      taskId = element.value
    } else if (!taskProtectedKey.includes(key) && element.value) {
      ;(task as any)[key] = transformVal(transforms, element.name, element.value, LName.discord, LName.database)
    }
  })
  // eslint-disable-next-line no-console
  console.log('updated task', task)
  try {
    const updated = await updateProjectTask(userId, hashtag, taskId, task)
    if (!updated) {
      return sendTxtLater(
        `La tache 💗: ${taskId}
N'exsite pas 🤯!`,
        [],
        interaction.application_id,
        interaction.token
      )
    }
    return sendTxtLater(
      `La tache 💗: ${taskId}
  A été mise a jour dans le projet #${hashtag.toLowerCase()}, 🎉!`,
      [],
      interaction.application_id,
      interaction.token
    )
  } catch (err) {
    console.error(err)
  }
}

const tasksView = async (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string): Promise<void> => {
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
    const allTaks = await getAllProjectsTasks(makerId, hashtag)
    let target
    if (allTaks.tasks.length === 0) {
      return sendTxtLater('Pas encore de taches sur ce projet, ça viendra !', [], interaction.application_id, interaction.token)
    } else if (makerId !== userId) {
      target = `<@${makerId}> a fait`
    } else {
      target = `Tu as fait`
    }
    const text = `${target} ${allTaks.total} taches sur #${hashtag}, BRAVO 🎉!`
    const taskInfos = `${text}!

    Voici La liste:\n\n`

    await sendTxtLater(taskInfos, [], interaction.application_id, interaction.token)
    const tasks = allTaks.tasks.sort((a, b) => a.id - b.id)
    for (let index = 0; index < tasks.length; index++) {
      const element = tasks[index]
      const taskInfos = `💗 ${element.id} - ${statusToText(element.status)}  - ${dayjs(element.createdAt).format('DD/MM/YYYY')}  - ${
        element.content
      }\n`
      await sendChannel(interaction.channel_id, taskInfos)
    }
    return Promise.resolve()
  } else {
    return sendTxtLater('Donne moi un projet !', [], interaction.application_id, interaction.token)
  }
}

const getTotalTaskAndStreakByUser = async (userId: string): Promise<{ tasks: number; streak: number }> => {
  const projects = await getAllProjects(userId)
  return projects.reduce((tt, c) => ({ tasks: tt.tasks + c.tasks, streak: tt.streak + c.streak }), { tasks: 0, streak: 0 })
}

const tasksDelete = (interaction: Interaction, options: ApplicationCommandInteractionDataOption[], userId: string): Promise<void> => {
  let hashtag = ''
  let taskId = ''
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (element.name === 'hashtag' && element.value) {
      hashtag = element.value
    } else if (element.name === 'id' && element.value) {
      taskId = element.value
    }
  })
  return Promise.all([
    getTotalTaskAndStreakByUser(userId).then((superTotal) => {
      const updatedUser: Partial<User> = {
        tasks: superTotal.tasks - 1,
        lastTaskAt: dayjs().toISOString(),
      }
      return updateUser(userId, updatedUser)
    }),
    getAllProjectsTasks(userId, hashtag).then((curTasks) => updateUser(userId, { tasks: curTasks.total - 1 })),
    deleteProjectTask(userId, hashtag, taskId),
    sendTxtLater(`Tu as supprimé la tache ${taskId} !`, [], interaction.application_id, interaction.token),
  ]).then(() => Promise.resolve())
}

export const taskFn = (interaction: Interaction, option: ApplicationCommandInteractionDataOption, userId: string): Promise<void> => {
  if (option.name === 'ajouter' && option.options && option.options.length > 0) {
    return taskAdd(interaction, option.options, userId)
  }
  if (option.name === 'liste' && option.options && option.options.length > 0) {
    return tasksView(interaction, option.options, userId)
  }
  if (option.name === 'modifier' && option.options && option.options.length > 0) {
    return taskEdit(interaction, option.options, userId)
  }
  if (option.name === 'supprimer' && option.options && option.options.length > 0) {
    return tasksDelete(interaction, option.options, userId)
  }
  return sendTxtLater(`La Commande ${option.name} n'est pas pris en charge 🤫`, [], interaction.application_id, interaction.token)
}
