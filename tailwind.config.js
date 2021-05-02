const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    extend: {
      typography: theme => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.orchid.300'),
              '&:hover': {
                color: theme('colors.orchid.100')
              },
              strong: {
                color: theme('colors.orchid.300'),
                '&:hover': {
                  color: theme('colors.orchid.100')
                }
              }
            }
          }
        }
      }),
      fontFamily: {
        indie: 'Rex Bold'
      },
      colors: {
        royalblue: {
          50: '#f8fafb',
          100: '#e9f1fc',
          200: '#d1d8fa',
          300: '#acb4f1',
          400: '#8c8ae6',
          500: '#7365dd',
          600: '#5e49cc',
          700: '#4b279b',
          800: '#30257a',
          900: '#1a174a'
        },
        orchid: {
          50: '#fbfbfa',
          100: '#f7eff6',
          200: '#efd0ed',
          300: '#df99d8',
          400: '#d47abd',
          500: '#c156a7',
          600: '#a63b89',
          700: '#802c67',
          800: '#5a1f44',
          900: '#351426'
        }
      },
      height: {
        78: '78vh'
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addBase, theme }) {
      addBase({
        a: {
          color: theme('colors.orchid.300'),
          '&:hover': {
            color: theme('colors.orchid.100')
          },
          strong: {
            color: theme('colors.orchid.300'),
            '&:hover': {
              color: theme('colors.orchid.100')
            }
          }
        }
      })
    })
  ],
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
