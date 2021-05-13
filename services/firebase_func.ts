const axios = require('axios')

const zone = 'us-central1'
const projectId = 'indiemakerfr'
const url = `https://${zone}-${projectId}.cloudfunctions.net/`

const run = async (name: string, data = { status: 'ok' }) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-verceladmin-apikey': 'dBk8RSx6cLeTKstmymQXEdrE6M7n',
    },
  }
  const response = await axios.post(url + name, data, options)
  return response.data
}

module.exports = {
  run,
}
