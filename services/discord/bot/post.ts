import dayjs from 'dayjs'
import {
  Interaction,
  ApplicationCommandInteractionDataOption,
} from '../command'
import {
  embed,
  sendChannel,
  sendTxtLater,
  sleep,
  getUserUrl,
  getLastChannelMessage,
} from './utils'
import { Embed, Post } from '../../../services/types'
import { updateUser } from '../../../services/firebase/discord'
import { updatePost, getLastPost, getAllPosts, getPostById, deletePost } from '../../../services/firebase/posts'

const postEdit = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  const update: Partial<Post> = {
    updatedAt: dayjs().toISOString(),
  }
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (
      element.name === 'hashtag' &&
      element.value &&
      /^[a-z]+$/.test(element.value)
    ) {
      update.hashtag = element.value
    } else if (element.name === 'id') {
      update.id = Number(element.value)
    }
  })
  const lastMesssage = await getLastChannelMessage(
    userId,
    interaction.channel_id
  )
  if (!lastMesssage) {
    return sendTxtLater(
      'Aucun message dans ce channel',
      [],
      interaction.application_id,
      interaction.token
    )
  }
  update.text = lastMesssage.content
  if (update.id) {
    console.error('postEdit', update)
    return Promise.all([
      sendTxtLater(
        `Tu as mis à jour le post #${update.id}`,
        [],
        interaction.application_id,
        interaction.token
      ),
      updatePost(userId, update.id, update),
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

const postAdd = async (
  interaction: Interaction,
  hashtag: string | undefined,
  userId: string
): Promise<void> => {
  const newPost: Partial<Post> = {
    createdAt: dayjs().toISOString(),
  }
  if (hashtag && /^[a-z]+$/.test(hashtag)) {
    newPost.hashtag = hashtag
  }
  const lastMesssage = await getLastChannelMessage(
    userId,
    interaction.channel_id
  )
  if (!lastMesssage) {
    return sendTxtLater(
      'Aucun message dans ce channel',
      [],
      interaction.application_id,
      interaction.token
    )
  }
  newPost.text = lastMesssage.content
  const lastPost = await getLastPost(userId)
  if (lastPost) {
    newPost.id = Number(lastPost.id) + 1
  } else {
    newPost.id = 0
  }
  console.error('add post', newPost)
  return Promise.all([
    updatePost(userId, newPost.id, newPost),
    getAllPosts({ userId }).then((allPost) =>
      updateUser(userId, { posts: allPost.length + 1 }).then((user) => {
        return sendTxtLater(
          `Tu as crée le post: #${newPost.id} 👏
    Tu peux voir tes posts sur ta page : ${getUserUrl(user)}`,
          [],
          interaction.application_id,
          interaction.token
        )
      })
    ),
  ]).then(() => Promise.resolve())
}

const postCard = (post: Post) => {
  return embed(
    `Post number ${post.id}`,
    post.text,
    undefined,
    undefined,
    undefined,
    undefined,
    post.createdAt
  )
}

const postList = async (
  interaction: Interaction,
  userId: string,
  me = false
): Promise<void> => {
  const cards: Embed[] = []
  const posts = await getAllPosts({ userId })
  // eslint-disable-next-line no-console
  console.log(`userId ${userId}, posts ${posts}`)
  posts.forEach((post: Post) => {
    cards.push(postCard(post))
  })
  console.error('post_list')
  if (cards.length > 0) {
    const sentence = me
      ? 'Voici la liste de tes posts !'
      : `Voici la liste des posts de <@${userId}> !`
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
      ? 'Tu n\'as pas encore de post, ajoute en avec la commande "/im post ajouter" !'
      : `<@${userId}> n'a pas encore de post !`
    return sendTxtLater(
      sentence,
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const postView = async (
  interaction: Interaction,
  options: ApplicationCommandInteractionDataOption[],
  userId: string
): Promise<void> => {
  let id = ''
  let makerId = userId
  options.forEach((element: ApplicationCommandInteractionDataOption) => {
    if (element.name === 'id') {
      id = element.value || ''
    } else if (element.name === 'maker') {
      makerId = element.value || ''
    }
  })
  if (id) {
    const post = await getPostById(makerId, id)
    if (post) {
      console.error('postView', id, makerId)
      const text =
        makerId === userId
          ? 'Voici les infos sur ton post !'
          : `Voici les infos sur le post de <@${makerId}> !`
      return sendTxtLater(
        `${text}\n`,
        [postCard(post)],
        interaction.application_id,
        interaction.token
      )
    } else {
      console.error('postView', id, makerId)
      return sendTxtLater(
        `Je ne trouve pas le post ${id} pour <@${makerId}>...`,
        [],
        interaction.application_id,
        interaction.token
      )
    }
  } else {
    return sendTxtLater(
      'Donne moi un post !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

const postDelete = (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  userId: string
): Promise<void> => {
  const id = option.value
  if (id) {
    console.error('postDelete', id)
    return Promise.all([
      deletePost(userId, id),
      sendTxtLater(
        `Tu as supprimé ton post ${id}`,
        [],
        interaction.application_id,
        interaction.token
      ),
    ]).then(() => Promise.resolve())
  } else {
    return sendTxtLater(
      'Donne moi un post !',
      [],
      interaction.application_id,
      interaction.token
    )
  }
}

export const postFn = (
  interaction: Interaction,
  option: ApplicationCommandInteractionDataOption,
  userId: string
): Promise<void> => {
  if (
    option.name === 'ajouter' &&
    option.options &&
    option.options.length > 0 &&
    option.options[0].value
  ) {
    return postAdd(interaction, option.options[0].value, userId)
  }
  if (option.name === 'ajouter') {
    return postAdd(interaction, undefined, userId)
  }
  if (
    option.name === 'modifier' &&
    option.options &&
    option.options.length > 0
  ) {
    return postEdit(interaction, option.options, userId)
  }
  if (
    option.name === 'liste' &&
    option.options &&
    option.options.length > 0 &&
    option.options[0].value
  ) {
    return postList(interaction, option.options[0].value)
  }
  if (option.name === 'liste') {
    return postList(interaction, userId, true)
  }
  if (
    option.name === 'voir' &&
    option.options &&
    option.options.length > 0 &&
    option.options[0].value
  ) {
    return postView(interaction, option.options, userId)
  }
  if (
    option.name === 'supprimer' &&
    option.options &&
    option.options.length > 0
  ) {
    return postDelete(interaction, option.options[0], userId)
  }
  if (option.name === 'aide') {
    return sendTxtLater(
      `Voici ce que tu peux faire avec la commande post:
  - **ajouter** (ajouter ton dernier message sur le channel en tant que post public)
    => Le markdown est utilisé pour formater le texte sur le site
    - hashtag: optionel (pas d'espace sans majuscules) si tu met un hashtag, le bot va lier le post au projet correspondant
  - **modifier** (modifier un post avec ton dernier message sur le channel)
    - id: obligatoire
  - **supprimer** (supprimer un de tes posts)
    - id: obligatoire
  - **liste** (lister les posts d'un Maker ou toi par défaut)
    - maker: optionnel
  - **voir** (voir un post d'un Maker ou toi par défaut)
      - id: obligatoire
      - maker: optionnel
  `,
      [],
      interaction.application_id,
      interaction.token
    )
  }
  return sendTxtLater(
    `La Commande ${option.name} n'est pas pris en charge 🤫`,
    [],
    interaction.application_id,
    interaction.token
  )
}
