import { firestore } from 'firebase-admin'

export const sendError = async (err: unknown) => {
  try {
    await firestore()
      .collection('errors')
      .add({ ...(err as any), createdAt: new Date().toISOString() })
  } catch (err) {
    console.error(err)
  }
  Promise.resolve()
}
