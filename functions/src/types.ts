export interface Image {
  url: string
}
export interface Field {
  name: string
  value: string
  inline: boolean
}
export interface Author {
  name: string
  url?: string
  // eslint-disable-next-line camelcase
  icon_url?: string
}
export interface Footer {
  text: string
  // eslint-disable-next-line camelcase
  icon_url: string
}

export interface Embed {
  title?: string
  description?: string
  url?: string
  color?: string
  fields?: Field[]
  author?: Author
  footer?: Footer
  timestamp?: string
  thumbnail?: Image
  image?: Image
}
export interface DiscordConfig {
  discordResetAfter: number
  channel_bip: string
  channel_intro: string
  channel_general: string
  discord: {
    bot_token: string
  }
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

export enum Category {
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
export enum TaskStatus {
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
