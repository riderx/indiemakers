import { v2 } from '@google-cloud/translate'
const { Translate } = v2

let translate: any

export const frToEn = async (text: string) => {
  // The target language
  const target = 'en'

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target)
  return translation
}

export const initTranslate = () => {
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    const googleId = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
    translate = new Translate({
      projectId: googleId.project_id,
      credentials: {
        client_email: googleId.client_email,
        private_key: googleId.private_key,
      },
    })
  }
}
