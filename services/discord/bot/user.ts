import dayjs from 'dayjs'
import admin from 'firebase-admin'
import {
  ApplicationCommandInteractionDataOption,
  Interaction,
} from '../command'
import {
  Embed,
  embed,
  field,
  getFields,
  getUserData,
  image,
  openChannel,
  sendChannel,
  sendTxtLater,
  transformKey,
} from './utils'
import { Project } from './project'
import { lastDay } from './tasks'

export interface User {
  userId: string
  avatar: string
  username: string
  avatarUrl: string
  streak: number
  karma: number
  projects: number
  incomes: number
  tasks: number
  emoji?: string
  color?: string
  name?: string
  bio?: string
  twitter?: string
  cover?: string
  website?: string
  lastTaskAt?: string
  makerlogHook?: string
  wipApiKey?: string
  projectsData?: Project[]
  createdAt: string
  updatedAt: string
}
const userPublicFlieds = ['karma', 'tasks', 'projects', 'streak']
const userProtectedKey = [
  'userId',
  'username',
  'karma',
  'avatar',
  'tasks',
  'projects',
  'streak',
  'createdAt',
  'updatedAt',
  'lastTaskAt',
]
interface UserTt {
  users: User[]
  total: number
}
export const getAllUsers = async (): Promise<UserTt> => {
  try {
    const documents = await admin.firestore().collection('/discord').get()
    const users: User[] = []
    documents.docs.forEach((doc) => {
      const data: User = doc.data() as User
      if (data !== undefined) {
        users.push(data)
      }
    })
    return { users, total: users.length }
  } catch (err) {
    console.error('getAllUsers', err)
    return { users: [], total: 0 }
  }
}

const translations = {
  couleur: 'color',
  nom: 'name',
  couverture: 'cover',
  makerlog: 'makerlogHook',
  wip: 'wipApiKey',
  photo: 'avatarUrl',
  '🔥 Flammes': 'streak',
  '🕉 karma': 'karma',
  '🌱 Projets': 'projects',
  '💗 Taches': 'tasks',
}

export const getUsersById = async (userId: string): Promise<User | null> => {
  try {
    const res = await admin.firestore().collection('/discord').doc(userId).get()
    const data = res.data()
    return data !== undefined ? (data as User) : null
  } catch (err) {
    console.error('getUsersById', err)
    return null
  }
}

export const updateUser = async (
  userId: string,
  user: Partial<User>
): Promise<any> => {
  const userDoc = await admin
    .firestore()
    .collection('/discord')
    .doc(userId)
    .get()
  if (!userDoc.exists || !userDoc.data) {
    const userInfo = await getUserData(userId)
    const base: User = {
      userId,
      avatar: '',
      avatarUrl: '',
      streak: 0,
      incomes: 0,
      karma: 0,
      projects: 0,
      tasks: 0,
      username: '',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    }
    if (userInfo) {
      base.avatar = userInfo.avatar
      base.avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.png`
      base.username = userInfo.username
    }
    const newUser: User = Object.assign(base, user as User)
    return admin.firestore().collection('discord').doc(userId).set(newUser)
  }
  return userDoc.ref.update({ ...user, updatedAt: dayjs().toISOString() })
}

const userEdit = (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  const update: Partial<User> = {
    updatedAt: dayjs().toISOString(),
  }
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    const realKey = transformKey(translations, element.name)
    if (!userProtectedKey.includes(realKey)) {
      ;(update as any)[realKey] = element.value
    }
  })
  console.error('userEdit', update)
  return Promise.all([
    updateUser(userId, update),
    sendTxtLater(
      'Tu as mis a jours ton profil !\n Cela aideras les autres makers a te connaitre !',
      [],
      interaction.application_id,
      interaction.token
    ),
  ]).then(() => Promise.resolve())
}

const userCard = (user: User) => {
  const fields = getFields(user, userPublicFlieds, translations)
  const name = `${user.emoji || '👨‍🌾'} ${user.name || user.username}`
  const bio = user.bio || 'Un jour je serai grand !'
  const thumb = image(user.avatarUrl)
  return embed(
    name,
    bio,
    user.color,
    fields,
    undefined,
    undefined,
    user.createdAt,
    undefined,
    thumb
  )
}

export const usersViewStreak = (res: UserTt): Embed[] => {
  const embeds: Embed[] = []
  const limitStreak = lastDay()
  let users = res.users.sort(
    (firstEl: User, secondEl: User) => secondEl.streak - firstEl.streak
  )
  users = users.filter((user: User) =>
    user.lastTaskAt ? dayjs(user.lastTaskAt).isAfter(limitStreak) : false
  )
  users.forEach((user: User) => {
    if (embeds.length < 10) {
      embeds.push(userCard(user))
    }
  })
  return embeds
}

const userList = async (interaction: Interaction): Promise<void> => {
  const res = await getAllUsers()
  await sendTxtLater(
    'Voici la liste des makers:',
    [],
    interaction.application_id,
    interaction.token
  )
  for (let index = 0; index < res.users.length; index++) {
    const user = res.users[index]
    const card = userCard(user)
    // console.error('card', card)
    await sendChannel(interaction.channel_id, '', card)
  }
  console.error('userList')
  return Promise.resolve()
}

const userListStreak = async (interaction: Interaction): Promise<void> => {
  const users = await getAllUsers()
  const usersInfoCards = usersViewStreak(users)
  console.error('userList', usersInfoCards)
  if (usersInfoCards.length > 0) {
    await sendTxtLater(
      `Voici la liste des 10 premiers makers avec les flammes !\n`,
      [],
      interaction.application_id,
      interaction.token
    )
    for (let index = 0; index < usersInfoCards.length; index++) {
      const card = usersInfoCards[index]
      // console.error('card', card)
      await sendChannel(interaction.channel_id, '', card)
    }
    return Promise.resolve()
  } else {
    return sendTxtLater(
      `Les makers n'ont plus de flamme 😢!`,
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const userView = async (
  interaction: Interaction,
  myId: string,
  userId: string | undefined
): Promise<void> => {
  const user = await getUsersById(userId || myId)
  if (user && userId && myId !== userId) {
    console.error('userView', userId)
    return sendTxtLater(
      `Voici les infos sur ce maker !\n`,
      [userCard(user)],
      interaction.application_id,
      interaction.token
    )
  } else if (user) {
    console.error('userView', userId)
    const card = userCard(user)
    if (user.makerlogHook && card.fields) {
      card.fields.push(field('Makerlog', String(user.makerlogHook), false))
    }
    if (user.wipApiKey && card.fields) {
      card.fields.push(field('WIP', String(user.wipApiKey), false))
    }
    await sendTxtLater(
      'Voici tes infos',
      [userCard(user)],
      interaction.application_id,
      interaction.token
    )
    await sendChannel(
      interaction.channel_id,
      `Je t'ai envoyé plus info en privé 🤫\n`
    )
    await openChannel(myId).then((channel) => {
      console.error('channel', channel)
      sendChannel(channel.id, `Voici tes infos complètes !\n`, card)
    })
    return Promise.resolve()
  }
  return sendTxtLater(
    `Je ne trouve pas <@${userId}>`,
    [],
    interaction.application_id,
    interaction.token
  )
}

export const userFn = (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  senderId: string
): Promise<void> => {
  if (
    option.name === 'modifier' &&
    option.options &&
    option.options.length > 0
  ) {
    return userEdit(interaction, option.options, senderId)
  }
  if (option.name === 'liste') {
    return userList(interaction)
  }
  if (option.name === 'flammes') {
    return userListStreak(interaction)
  }
  if (option.name === 'voir' && option.options && option.options.length > 0) {
    return userView(interaction, senderId, option.options[0].value)
  }
  if (option.name === 'voir') {
    return userView(interaction, senderId, undefined)
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token
  )
}
