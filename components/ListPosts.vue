<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <section aria-labelledby="activity-title" class="pb-2 md:px-4">
    <div>
      <div class="divide-y divide-gray-200">
        <div>
          <!-- Activity feed-->
          <div class="flow-root">
            <ul role="list">
              <li v-for="(post, itemIdx) in posts" :key="`${post.userId}_${post.id}`" class="bg-white">
                <div class="relative">
                  <span
                    v-if="itemIdx !== posts.length - 1"
                    class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-orchid-300"
                    aria-hidden="true"
                  />
                  <div class="relative flex items-start space-x-3">
                    <div class="relative">
                      <img
                        class="flex items-center justify-center w-10 h-10 rounded-full bg-orchid-300 ring-8 ring-white"
                        :src="post.userAvatarUrl"
                        :alt="`image profil ${post.userName || ''}`"
                      />

                      <span class="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px"> </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div>
                        <div class="text-sm">
                          <NuxtLink
                            :to="`/makers/${encodeURIComponent(post.userName || '')}`"
                            class="font-medium text-gray-900 cursor-pointer hover:text-royalblue-500"
                            >{{ post.userName }}</NuxtLink
                          >
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ post.createdAt }}
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-700">
                        <p class="prose-sm prose prose-blue" v-html="md.render(transformPost(post.text))"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import { Post, User } from '~/services/types'
  import MarkdownIt from 'markdown-it'

  const md = new MarkdownIt()
  // function to find user by userId in users list
  const findUser = (users: User[], userId: string) => {
    return users ? users.find((user) => user.userId === userId) : undefined
  }
  const { users } = defineProps({
    posts: { type: Array as () => Post[], default: () => [] as Post[] },
    users: { type: Array as () => User[], default: () => [] as User[] },
  })

  const transformPost = (text: string) => {
    if (typeof text !== 'string') return text
    const transformed = text.replace(/<@(.*)>/g, (userId: string) => {
      userId = userId.replace(/[^0-9.]/g, '')
      const user = findUser(users, userId)
      if (user) {
        return `<a href="/makers/${encodeURIComponent(user?.username)}">@${user?.username}</a>`
      } else {
        return `<a href="https://discordapp.com/users/${userId}">@${userId}</a>`
      }
    })
    return transformed
  }
</script>
