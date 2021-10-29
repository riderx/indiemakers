import { getFirestore } from 'firebase-admin/firestore'

import { Tool } from '../types'

export const getToolsDb = async (): Promise<Tool[] | null> => {
  try {
    const documents = await getFirestore().collection('/tools').orderBy('votes', 'desc').orderBy('addDate', 'asc').get()
    const tools: Tool[] = []
    documents.docs.forEach((doc) => {
      const data: Tool = doc.data() as Tool
      if (data !== undefined) {
        tools.push(data)
      }
    })
    return tools
  } catch (err) {
    console.error('getOnePodcastById', err)
    return null
  }
}
