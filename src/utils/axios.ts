import Axios from 'axios'
import { message } from 'antd'
import { store } from '@/store'
import { HashRouter } from 'react-router-dom'

interface AxiosConfig {
  timeout: number;
  baseURL?: string;
  headers: {
    'Content-Type': string
  };
}

const config: AxiosConfig = {
  timeout: 600000,
  baseURL:process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}

const axios:any = Axios.create(config)

const router: CommonObjectType = new HashRouter({})

// token失效，清除用户信息并返回登录界面
const clearAll = () => {
  store.dispatch({
    type: 'SET_USERINFO',
    payload: {}
  })
  router.history.replace({ pathname: '/login' })
}

// 请求前拦截
axios.interceptors.request.use(
  (req) => { 
    if (sessionStorage.getItem("TOKEN")) {
      req.headers.Token = sessionStorage.getItem("TOKEN")
    }
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 返回后拦截
axios.interceptors.response.use(
  ({ data, status }): Promise<any> => {
    if (status === 200 && data.code === 1200) {
      return Promise.resolve(data.t)
    }
    message.destroy()
    message.error(data.msg)
    return Promise.reject(data)
  },
  (err) => {
    message.destroy()
    message.error('网络异常')
    try {
      if (JSON.stringify(err).includes('403')) {
        clearAll()
      }
    } catch (error) {
      clearAll()
    } 
    return Promise.reject(err)
  }
)

// post请求
axios.post = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'post',
    url,
    data: params
  })

// get请求
axios.get = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'get',
    url,
    params
  })

axios.put = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'put',
    url,
    params
  })

axios.delete = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'delete',
    url,
    params
  })

export default axios
