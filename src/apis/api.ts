import axios from 'axios'

const appClient = axios.create({
  baseURL: 'http://localhost/api'
})
export default appClient
