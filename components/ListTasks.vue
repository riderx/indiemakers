<template>
  <LazyHydrate when-visible>
    <div class="w-full p-10 bg-white">
      <button class="mb-5 text-3xl text-royalblue-700 lg:mb-10 font-indie">
        Tasks
      </button>
      <div class="flex mb-5 border-b-2 lg:mb-10 border-royalblue-700">
        <button
          class="
            px-2
            mr-3
            text-2xl
            border-b-2
            text-royalblue-700
            border-royalblue-700
            focus:outline-none
          "
        >
          Done
        </button>
        <button
          class="
            mr-3
            text-2xl
            opacity-50
            text-royalblue-700
            px2
            focus:outline-none
          "
        >
          To do
        </button>
      </div>
      <article
        v-for="task in tasks"
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

<script>
export default {
  name: 'ListTasks',
  components: {
    LazyHydrate: () => import('vue-lazy-hydration'),
  },
  props: {
    tasks: {
      type: Array,
      default: () => [
        {
          id: 'biub',
          content: 'super task',
          status: 'todo',
          doneAt: false,
          createdAt: '12-05-2020',
        },
        {
          id: 'biub2',
          content: 'super task',
          status: 'todo',
          doneAt: false,
          createdAt: '12-05-2020',
        },
      ],
    },
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
