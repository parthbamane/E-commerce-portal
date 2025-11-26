import axios from 'axios'
const instance = axios.create({
  baseURL: 'https://e-commerce-portal-xi.vercel.app',
  timeout: 5000
})
export default instance
