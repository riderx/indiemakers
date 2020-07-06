const Parser = require('rss-parser')
const parser = new Parser()

export const feed = () => {
  return parser.parseURL(process.env.baseRSS)
}
