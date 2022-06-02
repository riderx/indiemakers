import { getFirestore } from 'firebase-admin/firestore'

export const sendError = async (err: unknown) => {
  try {
    await getFirestore()
      .collection('errors')
      .add({ ...(err as any), createdAt: new Date().toISOString() })
  } catch (err) {
    console.error(err)
  }
  Promise.resolve()
}
