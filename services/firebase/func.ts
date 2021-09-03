import axios from 'axios'

const zone = 'us-central1'
const projectId = 'indiemakerfr'
const url = `https://${zone}-${projectId}.cloudfunctions.net/`

export const run = async (name: string, data = { status: 'ok' }) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-verceladmin-apikey': process.env.FIREBASE_ADMIN_KEY,
    },
  }
  const response = await axios.post(url + name, data, options)
  return response.data
}
