import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
import 'dayjs/locale/fr'

dayjs.locale('fr')

export default dayjs
