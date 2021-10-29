import axios from 'axios'
import dayjs from 'dayjs'
import { firestore } from 'firebase-admin'
import { DiscordConfig, DiscordUser, User } from '../types'

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const documents = await firestore().collection('/discord').where('userId', '!=', null).get()
    const users: User[] = []
    documents.docs.forEach((doc) => {
      const data: User = doc.data() as User
      if (data !== undefined) {
        users.push(data)
      }
    })
    return users
  } catch (err) {
    console.error('getAllUsers', err)
    return []
  }
}

export const getUsersById = async (userId: string): Promise<User | null> => {
  try {
    const res = await firestore().collection('/discord').doc(userId).get()
    const data = res.data()
    return data !== undefined ? (data as User) : null
  } catch (err) {
    console.error('getUsersById', err)
    return null
  }
}

export const getUsersByUsername = async (username: string): Promise<User | null> => {
  try {
    const snapshot = await firestore().collection('/discord').where('username', '==', username).get()
    let data
    snapshot.forEach((doc) => {
      data = doc.data()
    })
    return data !== undefined ? (data as User) : null
  } catch (err) {
    console.error('getUsersById', err)
    return null
  }
}

export const saveRateLimit = (limit: string | number) => {
  console.error('sendChannel x-ratelimit-reset-after', limit)
  return firestore()
    .collection('bot')
    .doc('config')
    .update({
      discordResetAfter: Number(limit) * 1000,
    })
}

export const getConfig = async () => {
  const res = await firestore().collection('bot').doc('config').get()
  const data = res.data() as DiscordConfig
  return data
}

export const getUserData = async (userId: string): Promise<DiscordUser | undefined> => {
  const url = `https://discord.com/api/v8/users/${userId}`
  const data = await getConfig()
  if (!data) {
    return Promise.resolve(undefined)
  }
  const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN ? process.env.BOT_TOKEN : data.discord.bot_token}`,
  }
  try {
    const res = await axios.get(url, { headers })
    return Promise.resolve(res.data as DiscordUser)
  } catch (err) {
    console.error('getUserData', err)
    return Promise.resolve(undefined)
  }
}

export const updateUser = async (userId: string, user: Partial<User>): Promise<User> => {
  const userDoc = await firestore().collection('/discord').doc(userId).get()
  if (!userDoc.exists) {
    const userInfo = await getUserData(userId)
    const base: User = {
      userId,
      avatar: '',
      avatarUrl: '',
      streak: 0,
      bestStreak: 0,
      taskReminder: 'true',
      onboardingSend: false,
      mondayReminder: 'true',
      autoTranslate: true,
      voiceReminder: 'false',
      incomes: 0,
      karma: 0,
      projects: 0,
      posts: 0,
      tasks: 0,
      username: '',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    }
    if (userInfo) {
      if (userInfo.avatar) {
        base.avatar = userInfo.avatar
        base.avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.png`
      } else {
        base.avatarUrl = 'https://res.cloudinary.com/forgr/image/upload/v1621079734/indiemakers/cover-im_no_gjzhog.jpg'
      }
      base.username = userInfo.username
    }
    const newUser: User = Object.assign(base, user as User)
    await firestore().collection('discord').doc(userId).set(newUser)
    return newUser
  }
  await userDoc.ref.update({ ...user, updatedAt: dayjs().toISOString() })
  return userDoc.data() as User
}
