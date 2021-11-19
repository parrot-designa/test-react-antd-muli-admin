import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取数据 
  login(params?:Object){
    return $axios.post(`/login?${qs.stringify(params)}`)
  },
  getCurrentPermission(params?:Object){
    return $axios.get(`/role/user`)
  },
  // 获取分页数据  
  getList(params){
    return $axios.get(`/account/page`,params)
  },
  add(params){
    return $axios.post(`/account/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/account/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/account/${ids}`)
  },
  resetPassword(id){
    return $axios.put(`/account/reset-pwd/${id}`)
  },
}
