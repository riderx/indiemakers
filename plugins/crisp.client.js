export const crispLoader = () => {
  if (!window.$crisp) {
    console.log('Load Crips')
    window.$crisp = []
    window.CRISP_WEBSITE_ID = 'd87fdc65-9f0f-4ce9-920f-33e9a8bd0f18'

    const d = document
    const s = d.createElement('script')

    s.src = 'https://client.crisp.chat/l.js'
    s.async = 1
    d.getElementsByTagName('head')[0].appendChild(s)
  }
}
