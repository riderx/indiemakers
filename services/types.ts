/* eslint-disable camelcase */
import { Timestamp } from 'firebase-admin/firestore'
/**
 * User  discord interface
 *
 */
export interface Person {
  addedBy: string
  addDate: Timestamp
  updateDate: Timestamp
  toUpdate: boolean
  id_str: string
  name: string
  login: string
  description?: string
  bio: string
  pic: string
  votes: number
  number: number
}
export interface Tool {
  link: string
  name: string
  type: string
  image: string
  description: string
}
export interface Social {
  name: string
  link: string
}

export interface Episode {
  id: string
  guid: string
  title: string
  content: string
  pubDate: string
  name: string
  twitter: Social
  instagram: Social
  linkedin: Social
  social: Social
  preview?: string
  date?: string
  seoName: string
  image: string
  imageOptimized: string
  imageBig: string
  imageLoading: string
  audio: string
}

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

// eslint-disable-next-line no-unused-vars
enum TaskStatus {
  // eslint-disable-next-line no-unused-vars
  TODO = 'todo',
  // eslint-disable-next-line no-unused-vars
  DONE = 'done',
}
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

export interface Post {
  id?: number
  userId?: string
  userName?: string
  userAvatarUrl?: string
  text: string
  createdAt: string
  updatedAt: string
  hashtag: string
}

export interface PostAll {
  posts: Post[]
  total: number
}

export interface Income {
  id?: string
  ammount: number
  stripeCharges?: Income[]
  status: 'expense' | 'income'
  date: string
  createdAt?: string
  updatedAt?: string
}
export interface IncomeAll {
  incomes: Income[]
  total: number
}
export interface Project {
  error?: string
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
  postsData?: PostAll
  tasksData?: TaskAll
  incomesData?: IncomeAll
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
  isStripe?: boolean
  stripeApiKey?: string
}
export interface User {
  userId: string
  avatar: string
  username: string
  avatarUrl: string
  onboardingSend: boolean
  taskReminder: string
  mondayReminder: string
  voiceReminder: string
  streak: number
  bestStreak: number
  karma: number
  projects: number
  posts: number
  incomes: number
  tasks: number
  emoji?: string
  skills?: string
  color?: string
  name?: string
  bio?: string
  twitter?: string
  github?: string
  autoTranslate?: boolean
  makerlog?: string
  wip?: string
  nomadlist?: string
  cover?: string
  website?: string
  lastTaskAt?: string
  makerlogHook?: string
  wipApiKey?: string
  projectsData?: Project[]
  postsData?: Post[]
  createdAt: string
  updatedAt: string
}
