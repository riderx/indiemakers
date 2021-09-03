import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
require('dayjs/locale/fr')

dayjs.locale('fr')

export default dayjs
