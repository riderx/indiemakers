module.exports = {
  theme: {
    extend: {
      fontFamily: {
        indie: 'Rex Bold'
      },
      colors: {
        indiePurple: '#4b279b',
        indiePink: '#df99d8'
      }
    }
  },
  variants: {},
  plugins: [],
  purge: {
    // enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
      // TypeScript
      // 'plugins/**/*.ts',
      // 'nuxt.config.ts'
    ]
  }
}
