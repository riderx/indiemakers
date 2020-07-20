const Parser = require('rss-parser')
const parser = new Parser()

export const feed = () => {
  if (process.env.dev) {
    console.log('dev', `${process.env.domain_local}/${process.env.baseRSS}`)
    return parser.parseURL(`${process.env.domain_local}/${process.env.baseRSS}`)
  } else {
    console.log('prod', `${process.env.domain_local}/${process.env.baseRSS}`)
    return parser.parseURL(`${process.env.domain}/${process.env.baseRSS}`)
  }
}
