import axios from 'axios'

// creaate webhook without hashtag here: https://getmakerlog.com/integrations/webhooks
export const sendToMakerlog = async (
  webhook: string,
  content: string,
  done = true
): Promise<string | undefined> => {
  const task = await axios
    .post(webhook, {
      content,
      done,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('sendToMakerlog', err)
      return null
    })
  return Promise.resolve(task ? task.update_hook : undefined)
}
