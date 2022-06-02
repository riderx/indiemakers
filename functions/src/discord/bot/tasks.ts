import dayjs from 'dayjs'
import { Project, User } from './types'
import { updateUser } from './discord'
import { lastDay } from './utils'
import { getAllProjects, updateProject } from './project'

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

const getTotalTaskAndStreakByUser = async (userId: string): Promise<{ tasks: number; streak: number }> => {
  const projects = await getAllProjects(userId)
  return projects.reduce((tt, c) => ({ tasks: tt.tasks + c.tasks, streak: tt.streak + c.streak }), { tasks: 0, streak: 0 })
}
