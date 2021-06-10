import dayjs from 'dayjs'
import admin from 'firebase-admin'
import { Mutex } from 'await-semaphore'
import {
  Interaction,
  ApplicationCommandInteractionDataOption,
} from '../command'
import {
  Langs,
  LName,
  openChannel,
  sendChannel,
  sendTxtLater,
  t9r,
  transformKey,
  transformVal,
} from './utils'
import { updateUser, User, getUsersById } from './user'

import { sendToWip, updateToWip } from './wip'
import { sendToMakerlog } from './makerlog'
import {
  getAllProjects,
  getProjectById,
  Project,
  updateProject,
} from './project'

// eslint-disable-next-line no-unused-vars
enum TaskStatus {
  // eslint-disable-next-line no-unused-vars
  TODO = 'todo',
  // eslint-disable-next-line no-unused-vars
  DONE = 'done',
}
const projectSem: { [key: string]: Mutex } = {}
export interface Task {
  id: number
  content: string
  status: TaskStatus
  doneAt?: string
  wipId?: string
  makerlogHook?: string
  createdAt: string
  updatedAt: string
}
export interface TaskAll {
  tasks: Task[]
  total: number
}
const taskPublicKey = ['id', 'content', 'status', 'doneAt', 'createdAt']
const taskProtectedKey = [
  'id',
  'wipId',
  'makerlogHook',
  'createdAt',
  'doneAt',
  'updatedAt',
]
const statusToText = (status: TaskStatus) => {
  return status === TaskStatus.DONE ? 'Fait' : 'A faire'
}

const getLastTask = async (userId: string, hashtag: string) => {
  const taskList = await admin
    .firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
  return taskList[0]
}

const createProjectTask = async (
  applicationId: string,
  token: string,
  user: User,
  hashtag: string,
  task: Partial<Task>
): Promise<any> => {
  if (!projectSem[`$[user.userId}_${hashtag}`]) {
    projectSem[`$[user.userId}_${hashtag}`] = new Mutex()
  }
  const release = await projectSem[`$[user.userId}_${hashtag}`].acquire()
  try {
    const done = task.status !== TaskStatus.TODO
    const lastTask = await getLastTask(user.userId, hashtag)
    if (lastTask) {
      task.id = Number(lastTask.id) + 1
    }
    if (task.status === TaskStatus.DONE) {
      task.doneAt = dayjs().toISOString()
    }
    const taskWithHashtag = `${task.content} #${hashtag.toLowerCase()}`
    if (user?.makerlogHook && task?.content) {
      task.makerlogHook = await sendToMakerlog(
        user.makerlogHook,
        taskWithHashtag,
        done
      )
    }
    if (user?.wipApiKey && task?.content) {
      task.wipId = await sendToWip(user.wipApiKey, taskWithHashtag, done)
    }
    await sendTxtLater(
      `La tache 💗 ${task.id}:
${task.content}
A été ajouté au projet #${hashtag} 🎉!`,
      [],
      applicationId,
      token
    )
    const newTask = await admin
      .firestore()
      .collection(
        `discord/${user.userId}/projects/${hashtag.toLowerCase()}/tasks`
      )
      .add({ ...task, createdAt: dayjs().toISOString() })
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

const deleteProjectTask = (
  userId: string,
  hashtag: string,
  taskId: string
): Promise<any> => {
  return admin
    .firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
    .doc(taskId)
    .delete()
}

const updateProjectTask = async (
  userId: string,
  hashtag: string,
  taskId: string,
  task: Partial<Task>
): Promise<any> => {
  try {
    const user = await getUsersById(userId)
    const done = task.status ? task.status !== TaskStatus.TODO : true
    if (task.status && task.status === TaskStatus.DONE) {
      task.doneAt = dayjs().toISOString()
    }
    const taskWithHashtag = `${task.content} #${hashtag.toLowerCase()}`
    if (task?.makerlogHook && task?.content) {
      task.makerlogHook = await sendToMakerlog(
        task.makerlogHook,
        taskWithHashtag,
        done
      )
    }
    if (user?.wipApiKey && task?.wipId && task?.content) {
      task.wipId = await updateToWip(
        user.wipApiKey,
        task.wipId,
        taskWithHashtag,
        done
      )
    }
  } catch (err) {
    console.error('updateProjectTask', err)
  }
  const snapshot = await admin
    .firestore()
    .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
    .where('id', '==', parseInt(taskId))
    .get()
  let curTask
  snapshot.forEach((doc) => {
    // eslint-disable-next-line no-console
    console.log('doc', doc.id)
    curTask = doc.data()
    doc.ref.update({ ...task, updatedAt: dayjs().toISOString() })
  })
  return curTask
}

export const getAllProjectsTasks = async (
  userId: string,
  hashtag: string
): Promise<TaskAll> => {
  try {
    const documents = await admin
      .firestore()
      .collection(`discord/${userId}/projects/${hashtag.toLowerCase()}/tasks`)
      .orderBy('id', 'desc')
      .get()
    const tasks: Task[] = []
    documents.docs.map((doc) => {
      const data = doc.data() as Task
      if (data !== undefined) {
        tasks.push({ ...data })
      }
      return data
    })
    return { tasks, total: tasks.length }
  } catch (err) {
    console.error('getAllProjectsTasks', err)
    return { tasks: [], total: 0 }
  }
}

const transforms: Langs[] = [t9r('content', 'contenu', 'Contenu')]

export const lastDay = () => {
  let day = dayjs()
  day = day.set('hour', 0)
  day = day.set('minute', 0)
  day = day.set('second', 1)
  day = day.subtract(1, 'day')
  return day
}

export const resetProjectStreak = (
  userId: string | undefined,
  proj: Project
) => {
  const lastTaskAt = dayjs(proj.lastTaskAt)
  if (userId && (!proj.lastTaskAt || lastTaskAt.isBefore(lastDay()))) {
    try {
      const bestStreak =
        proj.bestStreak && proj.bestStreak > proj.streak
          ? proj.bestStreak
          : proj.streak
      return updateProject(userId, proj.hashtag, { streak: 0, bestStreak })
    } catch (err) {
      console.error(err)
    }
    return proj
  } else {
    return proj
  }
}

const updateProjectTaskAndStreak = async (
  userId: string,
  proj: Project | null
) => {
  if (!proj) return Promise.reject(Error('Projet introuvable'))
  const lowHash = proj.hashtag.toLowerCase()
  const curTasks = await getAllProjectsTasks(userId, lowHash)
  // enregistrer un premier revenu avec \`/im revenu ajouter hashtag: ${newProj.hashtag} revenu 42 mois: Février 2021 \`💰!
  if (curTasks.total === 1) {
    await openChannel(userId).then((channel) => {
      console.error('channel', channel)
      return sendChannel(
        channel.id,
        `Il est temps d'enregistrer un premier revenu 💰 ou dépense 💸 sur #${lowHash} avec:
  \`/im revenu ajouter hashtag:${lowHash} montant:-300 mois:Janvier année:2021 \`
💪 Fait le sur le salon #01_construire_en_public .`
      )
    })
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

export const resetUserStreak = (usr: User) => {
  const lastTaskAt = dayjs(usr.lastTaskAt)
  if (!usr.lastTaskAt || lastTaskAt.isBefore(lastDay())) {
    try {
      const bestStreak =
        usr.bestStreak && usr.bestStreak > usr.streak
          ? usr.bestStreak
          : usr.streak
      return updateUser(usr.userId, { streak: 0, bestStreak })
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

const taskAdd = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  let hashtag = ''
  const task: Partial<Task> = {
    status: TaskStatus.DONE,
  }
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(
      transforms,
      element.name,
      LName.discord,
      LName.database
    )
    if (element.name === 'hashtag' && element.value) {
      hashtag = element.value
    } else if (taskPublicKey.includes(key)) {
      ;(task as any)[key] = transformVal(
        transforms,
        element.name,
        element.value,
        LName.discord,
        LName.database
      )
    }
  })
  const curUser = await getUsersById(userId)
  if (curUser) {
    return createProjectTask(
      interaction.application_id,
      interaction.token,
      curUser,
      hashtag,
      task
    ).then(() => Promise.resolve())
  } else {
    return sendTxtLater(
      'Le Maker ou le projet est introuvable 🤫!',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const taskEdit = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  let hashtag = ''
  const task: Partial<Task> = {}
  let taskId = ''

  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const key = transformKey(
      transforms,
      element.name,
      LName.discord,
      LName.database
    )
    if (element.name === 'hashtag' && element.value) {
      hashtag = element.value
    } else if (element.name === 'id' && element.value) {
      taskId = element.value
    } else if (!taskProtectedKey.includes(key) && element.value) {
      ;(task as any)[key] = transformVal(
        transforms,
        element.name,
        element.value,
        LName.discord,
        LName.database
      )
    }
  })
  // eslint-disable-next-line no-console
  console.log('updated task', task)
  await updateProjectTask(userId, hashtag, taskId, task)
  return sendTxtLater(
    `La tache 💗: ${taskId}
A été mise a jour dans le projet #${hashtag.toLowerCase()}, 🎉!`,
    [],
    interaction.application_id,
    interaction.token
  )
}

const tasksView = async (
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
    const allTaks = await getAllProjectsTasks(makerId, hashtag)
    let target
    if (allTaks.tasks.length === 0) {
      return sendTxtLater(
        'Pas encore de taches sur ce projet, ça viendra !',
        [],
        interaction.application_id,
        interaction.token
      )
    } else if (makerId !== userId) {
      target = `<@${makerId}> a fait`
    } else {
      target = `Tu as fait`
    }
    const text = `${target} ${allTaks.total} taches sur ce projet, BRAVO 🎉!`
    const taskInfos = `${text}!

    Voici La liste:\n\n`

    await sendTxtLater(
      taskInfos,
      [],
      interaction.application_id,
      interaction.token
    )
    const tasks = allTaks.tasks.sort((a, b) => a.id - b.id)
    for (let index = 0; index < tasks.length; index++) {
      const element = tasks[index]
      const taskInfos = `💗 ${element.id} - ${statusToText(
        element.status
      )}  - ${dayjs(element.createdAt).format('DD/MM/YYYY')}  - ${
        element.content
      }\n`
      await sendChannel(interaction.channel_id, taskInfos)
    }
    return Promise.resolve()
  } else {
    return sendTxtLater(
      'Donne moi un projet !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const getTotalTaskAndStreakByUser = async (
  userId: string
): Promise<{ tasks: number; streak: number }> => {
  const projects = await getAllProjects(userId)
  return projects.reduce(
    (tt, c) => ({ tasks: tt.tasks + c.tasks, streak: tt.streak + c.streak }),
    { tasks: 0, streak: 0 }
  )
}

const tasksDelete = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
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
    getAllProjectsTasks(userId, hashtag).then((curTasks) =>
      updateUser(userId, { tasks: curTasks.total - 1 })
    ),
    deleteProjectTask(userId, hashtag, taskId),
    sendTxtLater(
      `Tu as supprimé la tache ${taskId} !`,
      [],
      interaction.application_id,
      interaction.token
    ),
  ]).then(() => Promise.resolve())
}

export const taskFn = (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  userId: string
): Promise<void> => {
  if (
    option.name === 'ajouter' &&
    option.options &&
    option.options.length > 0
  ) {
    return taskAdd(interaction, option.options, userId)
  }
  if (option.name === 'liste' && option.options && option.options.length > 0) {
    return tasksView(interaction, option.options, userId)
  }
  if (
    option.name === 'modifier' &&
    option.options &&
    option.options.length > 0
  ) {
    return taskEdit(interaction, option.options, userId)
  }
  if (
    option.name === 'supprimer' &&
    option.options &&
    option.options.length > 0
  ) {
    return tasksDelete(interaction, option.options, userId)
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token
  )
}
