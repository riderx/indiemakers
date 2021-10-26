module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    'max-len': [1, { code: 140 }],
    'no-unused-vars': ['error', { args: 'after-used' }],
    'no-console': ['error', { allow: ['off', 'error'] }],
  },
}
