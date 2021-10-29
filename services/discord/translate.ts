import { v2 } from '@google-cloud/translate'
const { Translate } = v2

export const frToEn = async (translate: v2.Translate | null, text: string) => {
  if (!translate) return text
  // The target language
  const target = 'en'

  // Translates some text into French
  try {
    const [translation] = await translate.translate(text, target)
    return translation
  } catch (err) {
    console.error('frToEn', err)
    return text
  }
}

export const initTranslate = () => {
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    const googleId = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
    return new Translate({
      projectId: googleId.project_id,
      credentials: {
        client_email: googleId.client_email,
        private_key: googleId.private_key,
      },
    })
  }
  return null
}
