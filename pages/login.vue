<template>
  <div class="flex items-center justify-center pt-40">
    <div class="w-full max-w-md px-4 space-y-8 sm:px-4">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-center text-white">
          🔑 Email Verification
        </h2>
      </div>
      <form class="mt-8 space-y-6" action="#" method="POST">
        <input type="hidden" name="remember" value="true" />
        <div class="-space-y-px shadow-sm">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="elon@musk.com"
              required
              class="
                relative
                block
                w-full
                px-3
                py-2
                text-gray-900
                placeholder-gray-500
                border border-gray-300
                appearance-none
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="
              relative
              flex
              justify-center
              w-full
              px-5
              py-2
              text-white
              border-4 border-white
              group
              hover:border-gray-200
              hover:text-royalblue-700
              hover:bg-gray-200
              font-indie
            "
            @click="sendConfirm()"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <!-- Heroicon name: lock-closed -->
              <svg
                class="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            🚀 valider
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      title: 'Login to indie makers',
      message: 'To allow you vote for makers',
      image: require('~/assets/images/cover-im@0.5x.png'),
      isFalse: false,
      user: null,
      email: null,
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.DOMAIN}${this.$route.fullPath}`,
        },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        {
          hid: 'description',
          name: 'description',
          content: this.removeEmoji(this.message),
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.removeEmoji(this.title),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.removeEmoji(this.message),
        },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/png',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${
            this.$config.DOMAIN
          }${require('~/assets/images/cover-im@0.5x.png')}`,
        },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
      ],
    }
  },
  mounted() {
    this.email = this.$warehouse.get('emailForSignIn')
    this.$firebase.auth.listen((user) => {
      this.user = user
      if (this.user && this.user.displayName === null) {
        this.$modal.show('confirmName')
      } else if (this.user) {
        this.$firebase.db.ref(`users/${this.user.id}`).set({
          name: this.user.displayName,
          email: this.user.email,
        })
        const next = this.$warehouse.get('nextAfterSign')
        if (next) {
          this.$warehouse.remove('nextAfterSign')
        }
        this.$router.push(next || '/makers')
      }
    })
    if (this.email) {
      this.sendConfirm()
    }
  },
  methods: {
    removeEmoji(str) {
      return str.replace(
        /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
        ''
      )
    },
    sendConfirm() {
      if (this.email) {
        this.$modal.show('loading')
        this.$firebase.auth
          .handleSignInRedirect({
            email: this.email,
          })
          .then(() => {
            this.$warehouse.remove('emailForSignIn')
            this.email = null
            this.$modal.hide('loading')
          })
          .catch((error) => {
            console.error(error)
            this.$modal.hide('loading')
            this.$router.push('/')
          })
      }
    },
  },
}
</script>
