const Parser = require('rss-parser')
const parser = new Parser()

export const feed = () => {
  if (process.env.dev) {
    return parser.parseURL(`${process.env.domain_local}/${process.env.baseRSS}`)
  } else {
    return parser.parseURL(`${process.env.domain}/${process.env.baseRSS}`)
  }
}
