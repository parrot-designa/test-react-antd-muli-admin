import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取数据 
  getCurrentPermission(params?:Object){
    return $axios.get(`/role/user`)
  },
  getCurrentFunctionPermission(params?:Object){
    return $axios.get(`/role/user/functions`)
  },
}
