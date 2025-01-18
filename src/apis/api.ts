import axios from 'axios'

export const authClient = axios.create({
  baseURL: 'http://localhost:32678/api'
})

export const postClient = axios.create({
  baseURL: 'http://localhost:32679/api'
})

export const storyClient = axios.create({
  baseURL: 'http://localhost:32680/api'
})

export const notificationClient = axios.create({
  baseURL: 'http://localhost:32681/api'
})

export const chatClient = axios.create({
  baseURL: 'http://localhost:32682/api'
})
