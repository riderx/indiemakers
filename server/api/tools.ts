import initF from '~~/services/firebase/init'
import { getToolsDb } from '~~/services/firebase/tools'

export default defineEventHandler(async (event) => {
  initF()
  try {
    const tools = await getToolsDb()
    return tools
  } catch (err) {
    console.error(err);
    return []
  }
})

