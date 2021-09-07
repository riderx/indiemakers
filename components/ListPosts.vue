<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <section aria-labelledby="activity-title" class="pb-2 md:px-4">
    <div>
      <div class="divide-y divide-gray-200">
        <div>
          <!-- Activity feed-->
          <div class="flow-root">
            <ul role="list">
              <li
                v-for="(post, itemIdx) in posts"
                :key="`${post.userId}_${post.id}`"
                class="bg-white"
              >
                <div class="relative">
                  <span
                    v-if="itemIdx !== posts.length - 1"
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-orchid-300
                    "
                    aria-hidden="true"
                  />
                  <div class="relative flex items-start space-x-3">
                    <div class="relative">
                      <img
                        class="
                          flex
                          items-center
                          justify-center
                          w-10
                          h-10
                          rounded-full
                          bg-orchid-300
                          ring-8 ring-white
                        "
                        :src="post.userAvatarUrl"
                        alt=""
                      />

                      <span
                        class="
                          absolute
                          -bottom-0.5
                          -right-1
                          bg-white
                          rounded-tl
                          px-0.5
                          py-px
                        "
                      >
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div>
                        <div class="text-sm">
                          <a
                            class="font-medium text-gray-900"
                            @click="openProfil(post.userName)"
                            >{{ post.userName }}</a
                          >
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ post.createdAt }}
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-700">
                        <p
                          class="prose-sm prose prose-blue"
                          v-html="$md.render(post.text)"
                        ></p>
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
<script lang="ts">
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import { Post } from '~/services/types'

export default defineComponent({
  props: {
    posts: { type: Array as () => Post[], default: () => [] as Post[] },
  },
  setup() {
    const router = useRouter()
    const openProfil = (id: string | undefined) => {
      if (id) {
        router.push(`/makers/${encodeURI(id)}`)
      }
    }
    return { openProfil }
  },
})
</script>