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
              hover:border-gray-200 hover:text-royalblue-700 hover:bg-gray-200
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

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  useContext,
  useMeta,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { createMeta } from '~/services/meta'

export default defineComponent({
  setup() {
    const { $config, $firebase, $modal, $warehouse } = useContext()
    const { title, meta } = useMeta()
    const router = useRouter()
    const route = useRoute()
    const email = ref('')
    const desc = 'Pour voter pour tes makers favorie'
    title.value = 'Connecte toi a indie makers'
    meta.value = createMeta(
      `${$config.DOMAIN}${route.value.fullPath}`,
      title.value,
      desc,
      'https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg'
    )
    onMounted(() => {
      email.value = $warehouse.get('emailForSignIn')
      $firebase.auth.listen((user: any) => {
        if (user && user.displayName === null) {
          $modal.show('confirmName')
        } else if (user) {
          $firebase.db.ref(`users/${user.id}`).set({
            name: user.displayName,
            email: user.email,
          })
          const next = $warehouse.get('nextAfterSign')
          if (next) {
            $warehouse.remove('nextAfterSign')
          }
          router.push(next || '/makers')
        }
      })
      if (email.value) {
        sendConfirm()
      }
    })
    const sendConfirm = () => {
      if (email.value) {
        $modal.show('loading')
        $firebase.auth
          .handleSignInRedirect({
            email: email.value,
          })
          .then(() => {
            $warehouse.remove('emailForSignIn')
            email.value = ''
            $modal.hide('loading')
          })
          .catch((error: any) => {
            console.error(error)
            $modal.hide('loading')
            router.push('/')
          })
      }
    }
    return { sendConfirm, email }
  },
})
</script>
