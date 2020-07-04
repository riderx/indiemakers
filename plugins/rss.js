const Parser = require('rss-parser')
const parser = new Parser()

// let res = null
export const feed = () => {
  return parser.parseURL(process.env.baseRSS)
}
//   .then((resFeed) => {
//     res = resFeed
//     // eslint-disable-next-line no-console
//     // console.log('feed', resFeed)
//   }).catch((error) => {
//   // eslint-disable-next-line no-console
//     console.error('Feed Error', error)
//   })

// export const feed = res
