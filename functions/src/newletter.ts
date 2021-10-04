import axios, { AxiosResponse } from 'axios'
import { config } from 'firebase-functions'

const configSecret = config()

export const sendUserToRevue = (
  email: string,
  firstName: string
): Promise<AxiosResponse<any>> =>
  axios({
    method: 'POST',
    url: '/api/v2/subscribers',
    baseURL: 'https://www.getrevue.co',
    headers: {
      Authorization: `Token ${configSecret.getrevue.apikey}`
    },
    data: {
      email,
      first_name: firstName,
      double_opt_in: false,
  }
})
