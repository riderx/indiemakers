export default ({ app }) => {
  // Every time the route changes (fired on initialization too)
  app.router.beforeEach((to, from, next) => {
    // Redirect if fullPath begins with a hash (ignore hashes later in path)
    if (to.fullPath.substr(0, 2) === '/#') {
      const path = to.fullPath.substr(2)
      next(path)
      return
    }
    next()
  })
}
