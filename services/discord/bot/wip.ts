import axios from 'axios'

// get apikey here: https://wip.co/api
const url = 'https://wip.chat/graphql'

export const doneToWip = async (
  key: string,
  id: string
): Promise<string | undefined> => {
  const headers = {
    Authorization: `bearer ${key}`,
  }
  const queryDone = {
    query: `
    mutation completeTodo {
      completeTodo(id: "${id}") {
        id
        body
        completed_at
      }
    }
  `,
  }
  // `,variables: { body: content }};
  const res = await axios
    .post(url, queryDone, { headers })
    .then((res) => res.data.data.completeTodo)
    .catch((err) => {
      console.error('doneToWip', err)
      return {}
    })
  return Promise.resolve(res ? res.id : undefined)
}

export const unDoneToWip = async (
  key: string,
  id: string
): Promise<string | undefined> => {
  const headers = {
    Authorization: `bearer ${key}`,
  }
  const queryDone = {
    query: `
    mutation uncompleteTodo {
      uncompleteTodo(id: "${id}") {
        id
        body
        completed_at
      }
    }
  `,
  }
  const res = await axios
    .post(url, queryDone, { headers })
    .then((res) => res.data.data.completeTodo)
    .catch((err) => {
      console.error('unDoneToWip', err)
      return {}
    })
  return Promise.resolve(res ? res.id : undefined)
}

export const updateToWip = async (
  key: string,
  id: string,
  content: string,
  done = true
): Promise<string | undefined> => {
  const headers = {
    Authorization: `bearer ${key}`,
  }
  const queryDone = {
    query: `
    mutation updateTodoBody {
      updateTodoBody(id: ${id},input: {body: "${content}"}) {
        id
        body
        completed_at
      }
    }
  `,
  }
  const task = await axios
    .post(url, queryDone, { headers })
    .then((res) => res.data.data.completeTodo)
    .catch((err) => {
      console.error('updateToWip', err)
      return {}
    })
  if (done && task && !task.errors) {
    return doneToWip(key, task.id)
  }
  if (!done && task && !task.errors) {
    return unDoneToWip(key, task.id)
  }
  return Promise.resolve(task ? task.id : undefined)
}

export const sendToWip = async (
  key: string,
  content: string,
  done = true
): Promise<string | undefined> => {
  const headers = {
    Authorization: `bearer ${key}`,
  }
  const queryCreate = {
    query: `
    mutation createTodo {
      createTodo(input: {body: "${content}"}) {
        id
        body
        completed_at
      }
    }
  `,
  }
  const task = await axios
    .post(url, queryCreate, { headers })
    .then((res) => res.data.data.createTodo)
    .catch((err) => {
      console.error('sendToWip', err)
      return null
    })
  if (done && task && !task.errors) {
    return doneToWip(key, task.id)
  }
  return Promise.resolve(task ? task.id : undefined)
}
