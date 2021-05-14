<template>
  <div class="w-1/2 p-10 bg-white">
    <button class="mb-5 text-3xl text-royalblue-700 lg:mb-10 font-indie">
      Taches {{ all.total }}
    </button>
    <div class="flex mb-5 border-b-2 lg:mb-10 border-royalblue-700">
      <button
        class="mr-3 text-2xl text-royalblue-700 focus:outline-none"
        :class="{
          'border-b-2 border-royalblue-700 px-2': status === 'done',
          'opacity-50': status === 'todo',
        }"
        @click="status = 'done'"
      >
        Fait {{ done.total }}
      </button>
      <button
        class="mr-3 text-2xl text-royalblue-700 focus:outline-none"
        :class="{
          'border-b-2 border-royalblue-700 px-2': status === 'todo',
          'opacity-50': status === 'done',
        }"
        @click="status = 'todo'"
      >
        A faire {{ todo.total }}
      </button>
    </div>
    <article
      v-for="task in filtered"
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
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Task, TaskAll } from '~/services/discord/bot/tasks'
export default Vue.extend({
  name: 'ListTasks',
  props: {
    all: {
      type: Object,
      default: () => {},
    } as PropOptions<TaskAll>,
  },
  data() {
    return {
      todo: [] as Task[],
      done: [] as Task[],
      status: 'done',
    }
  },
  computed: {
    filtered(): Task[] {
      return this.status === 'todo' ? this.todo : this.done
    },
  },
  mounted() {
    // this.projectId = this.user.projectsData[0].hashtag
    this.todo = this.all.tasks.filter((a: Task) => a.status === 'todo')
    this.done = this.all.tasks.filter((a: Task) => a.status === 'done')
  },
})
</script>
