import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 300秒超时
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('响应错误:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

// API 函数
export const getHealthStatus = async () => {
  const response = await api.get('/')
  return response.data
}

export const getSchemas = async () => {
  const response = await api.get('/schemas')
  return response.data
}

export const getExamples = async () => {
  const response = await api.get('/examples')
  return response.data
}

export const processQuery = async (queryData) => {
  const response = await api.post('/query', queryData)
  return response.data
}

export default api
