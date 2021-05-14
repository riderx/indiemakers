<template>
  <LazyHydrate when-visible>
    <div class="w-full p-10 bg-white">
      <button class="mb-5 text-3xl text-royalblue-700 lg:mb-10 font-indie">
        Tasks
      </button>
      <div class="flex mb-5 border-b-2 lg:mb-10 border-royalblue-700">
        <button
          class="px-2 mr-3 text-2xl text-royalblue-700 focus:outline-none"
          :class="{
            'border-b-2 border-royalblue-700 ': status === 'done',
            'opacity-50': status === 'todo',
          }"
          @click="status = 'done'"
        >
          Done
        </button>
        <button
          class="mr-3 text-2xl text-royalblue-700 px2 focus:outline-none"
          :class="{
            'border-b-2': status === 'todo',
            'opacity-50': status === 'done',
          }"
          @click="status = 'todo'"
        >
          To do
        </button>
      </div>
      <article
        v-for="task in filterTasks"
        :key="task.id"
        class="py-5 border-b-2 lg:mx-10 border-orchid-300"
      >
        <h1 class="text-xl">
          {{ task.content }}
        </h1>
        <time class="text-sm text-royalblue-700" :datetime="task.createdAt">{{
          task.createdAt
        }}</time>
      </article>
    </div>
  </LazyHydrate>
</template>

<script lang="ts">
import { Task } from '~/services/discord/bot/tasks'
export default {
  name: 'ListTasks',
  components: {
    LazyHydrate: () => import('vue-lazy-hydration'),
  },
  props: {
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filterTasks: [],
      status: 'done',
    }
  },
  watch: {
    // whenever question changes, this function will run
    status(newStatus) {
      this.filterTasks = this.tasks.filter((a: Task) => a.status === newStatus)
    },
  },
  mounted() {
    // this.projectId = this.user.projectsData[0].hashtag
    this.filterTasks = this.tasks.filter((a: Task) => a.status === this.status)
  },
}
</script>

<style scoped>
.h-w-screen {
  height: 100vw;
}

.square::after {
  content: '';
  display: block;
  padding-bottom: 100%;
}
@media screen and (min-width: 768px) {
  .tumb_up {
    /* bottom: -10px; */
    font-size: 20px;
  }
}
</style>
