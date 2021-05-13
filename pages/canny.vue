<template>
  <div class="px-3 bg-white" data-canny />
</template>

<script>
const BoardToken = '36135883-e2d9-b3dc-7e41-27df837063bf'

export default {
  mounted() {
    ;(function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          const f = d.getElementsByTagName(s)[0]
          const e = d.createElement(s)
          e.type = 'text/javascript'
          e.async = !0
          e.src = 'https://canny.io/sdk.js'
          f.parentNode.insertBefore(e, f)
        }
      }
      if (typeof w.Canny !== 'function') {
        const c = function () {
          c.q.push(arguments)
        }
        c.q = []
        w.Canny = c
        d.readyState === 'complete'
          ? l()
          : w.attachEvent
          ? w.attachEvent('onload', l)
          : w.addEventListener('load', l, !1)
      }
    })(window, document, 'canny-jssdk', 'script')

    // eslint-disable-next-line no-undef
    Canny('render', {
      boardToken: BoardToken,
      basePath: null, // See step 2
      ssoToken: null, // See step 3
    })
  },
}
</script>
