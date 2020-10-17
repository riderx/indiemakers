<script>
import { feed } from '~/plugins/rss'

export default {
  async fetch () {
    const res = await feed()
    if (res && res.items) {
      const element = res.items[0]
      this.url = `/episode/${element.guid}`
    }
  },
  data () {
    return {
      url: '/'
    }
  },
  mounted () {
    this.$router.push(this.url)
  }
}
</script>
