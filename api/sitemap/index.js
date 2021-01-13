const { SitemapStream, streamToPromise } = require('sitemap')
const util = require('../../plugins/feed')
// const func = require('../../plugins/firebase_func')

module.exports = async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: 'https://indiemakers.fr' })

    smStream.write({ url: '/tools', changefreq: 'monthly', priority: 0.1 })
    smStream.write({ url: '/makers_hunt', changefreq: 'daily', priority: 0.1 })
    const eps = await util.feed()
    // const results = await func.run('getMakers')
    let prio = 1.0

    eps.forEach((element) => {
      smStream.write({ url: `/episode/${element.guid_fix}`, changefreq: 'daily', priority: prio })
      prio = prio / 2
    })
    // results.forEach((element) => {
    //   smStream.write({ url: `/makers/${element.login}`, changefreq: 'daily', priority: 0.1 })
    // })

    smStream.end()
    streamToPromise(smStream).then(data =>
      res.send(data.toString())
    )
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
