<template>
  <div>
    <div class="relative">
      <img
        class="h-72 w-full object-cover"
        src="https://cdn.hovia.com/app/uploads/Red-Illustrated-Landscape-Sunset-Wallpaper-Mural-plain.jpg"
        alt="cover profil"
      />
      <img
        class="
          absolute
          -bottom-1/4
          h-36
          w-36
          object-cover
          rounded-full
          border-2 border-orchid-300
          inset-x-0
          mx-auto
        "
        src="https://cdn.hovia.com/app/uploads/Red-Illustrated-Landscape-Sunset-Wallpaper-Mural-plain.jpg"
        alt="cover profil"
      />
    </div>
    <div class="flex flex-col items-center justify-center">
      <h1 class="mt-20 font-medium text-3xl text-orchid-300 font-indie">
        Name user
      </h1>
      <p class="text-royalblue-700 text-lg bg-white rounded-lg px-4 py-1">
        🕉 25
      </p>
    </div>
    <div class="flex flex-col md:flex-row m-5 md:m-10">
      <div
        class="
          bg-white
          text-royalblue-700 text-lg
          p-5
          md:p-10
          mb-2
          md:mb-0
          md:w-2/5
          lg:w-1/5
        "
      >
        <h1
          class="
            hidden
            md:block
            text-3xl text-royalblue-700
            mb-5
            lg:mb-10
            font-indie
          "
        >
          Projects
        </h1>
        <div class="overflow-x-scroll flex w-full md:flex-col">
          <div
            v-for="project in projects"
            :key="project.hashtag"
            class="my-4 md:my-2 lg:my-4 flex-none ml-3 md:ml-0"
          >
            <div class="relative flex items-end">
              <img
                class="
                  h-10
                  w-10
                  object-cover
                  rounded-lg
                  border border-royalblue-700
                "
                src="https://cdn.hovia.com/app/uploads/Red-Illustrated-Landscape-Sunset-Wallpaper-Mural-plain.jpg"
              />
              <h2 class="mx-1 truncate">
                {{ project.name }}
              </h2>
              <span
                class="
                  absolute
                  bottom-0
                  text-sm text-white
                  bg-royalblue-700 bg-opacity-75
                  rounded-bl-lg rounded-tr-lg
                "
                >🔥{{ project.flamme }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="md:w-4/5 md:mx-2">
        <div
          class="
            flex
            items-center
            bg-white
            text-royalblue-700
            p-10
            mb-2
            flex-col
            lg:flex-row
          "
        >
          <img
            class="
              h-32
              w-32
              object-cover
              rounded-lg
              border border-royalblue-700
              mb-5
              lg:mb-0
              lg:mr-3
            "
            src="https://cdn.hovia.com/app/uploads/Red-Illustrated-Landscape-Sunset-Wallpaper-Mural-plain.jpg"
          />
          <div class="text-center lg:text-left">
            <h1 class="text-3xl font-indie">
              Project name <span class="text-base">🔥25</span>
            </h1>
            <p class="text-xl my-2">Picth description du proect super genial</p>
            <a class="text-lg">https://www.Website.com</a>
          </div>
        </div>
        <ListTasks />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    ListTasks: () => import('~/components/ListTasks.vue'),
  },
  data() {
    return {
      projects: [
        {
          hashtag: 'uhhoo',
          description: 'blablbalbalblbablab',
          name: 'name project1',
          flamme: 5,
          website: 'https://shannone.controu.com',
        },
        {
          hashtag: 'uhsdhoo',
          description: 'blablbalbalblbablab',
          name: 'name project2',
          flamme: 25,
          website: 'https://shannone.controu.com',
        },
      ],
    }
  },
  mounted() {
    console.error('mounted', this.projects)
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>
