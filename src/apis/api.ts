import axios from 'axios'

const appClient = axios.create({
  baseURL: 'http://localhost:32678/api'
})
export default appClient
