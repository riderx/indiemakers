import { Context } from '@nuxt/types'

export default ({ app }: Context) => {
  // Every time the route changes (fired on initialization too)
  if (app && app.router) {
    app.router.beforeEach((to, from, next) => {
      // Redirect if fullPath begins with a hash (ignore hashes later in path)
      if (to.fullPath.substr(0, 2) === '/#' && from) {
        const path = to.fullPath.substr(2)
        next(path)
        return
      }
      next()
    })
  }
}
