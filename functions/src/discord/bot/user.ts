import dayjs from 'dayjs'
import { User, Embed } from './types'
import { embed, getFields, getUserUrl, image, l3s, Langs, lastDay, t9r } from './utils'

const userPublicFlieds = ['karma', 'streak', 'tasks', 'projects', 'website', 'skills', 'twitter', 'wip', 'makerlog', 'nomadlist', 'cover']

const transforms: Langs[] = [
  t9r('color', 'couleur', 'Couleur'),
  t9r('name', 'nom', 'Nom'),
  t9r(
    'cover',
    'couverture',
    l3s('Couverture', (d) => (d ? 'Configuré' : 'Pas configuré'))
  ),
  t9r(
    'taskReminder',
    'rappel_tache',
    l3s('Rappel journalier de tache', (d) => (d === 'true' ? 'Oui' : 'Non'))
  ),
  t9r('mondayReminder', 'rappel_lundi', 'Rappel du résumé du lundi'),
  t9r('voiceReminder', 'rappel_vocal', 'Rappel du vocal mensuel'),
  t9r('makerlogHook', 'makerlog_hook', 'Makerlog webhook', undefined, false),
  t9r('nomadlist', 'nomadlist', 'nomadlist', undefined, false),
  t9r('wip', 'wip', 'wip.co', undefined, false),
  t9r('makerlog', 'makerlog', 'getmakerlog.com', undefined, false),
  t9r('wipApiKey', 'wip_key', 'WIP clé API', undefined, false),
  t9r('avatarUrl', 'photo', 'Photo', undefined, false),
  t9r(
    'website',
    l3s('website', (d) => {
      return d.startsWith('https://') ? d : d.startsWith('http://') ? d.replace('http://', 'https://') : `https://${d}`
    }),
    'Site web',
    undefined,
    false
  ),
  t9r('github', 'github', 'Github', undefined, false),
  t9r('twitter', 'twitter', 'Twitter', undefined, false),
  t9r('skills', 'talents', 'Talents'),
  t9r('streak', 'flammes', '🔥 Flammes'),
  t9r('karma', 'karma', '🕉 Karma'),
  t9r('projects', 'projets', '🌱 Projets'),
  t9r('tasks', 'taches', '💗 Taches'),
]

const userCard = (user: User) => {
  const fields = getFields(user, userPublicFlieds, transforms)
  const name = `${user.emoji || '👨‍🌾'} ${user.name || user.username}`
  const bio = user.bio || 'Indie Maker en devenir !'
  const thumb = image(user.avatarUrl)
  return embed(name, bio, user.color, fields, undefined, undefined, user.createdAt, getUserUrl(user), thumb)
}

export const usersViewStreak = (usrs: User[]): Embed[] => {
  const embeds: Embed[] = []
  const limitStreak = lastDay()
  let users = usrs.sort((firstEl: User, secondEl: User) => secondEl.streak - firstEl.streak)
  users = users.filter((user: User) => (user.lastTaskAt ? dayjs(user.lastTaskAt).isAfter(limitStreak) : false))
  users.forEach((user: User) => {
    if (embeds.length < 10) {
      embeds.push(userCard(user))
    }
  })
  return embeds
}
