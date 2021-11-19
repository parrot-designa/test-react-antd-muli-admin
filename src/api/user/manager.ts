import $axios from '@/utils/axios'
import qs from 'qs'

export default {  
  // 获取分页数据  
  getList(params){
    return $axios.get(`/user/page`,params)
  },
  getAllList(){
    return $axios.get(`/user/list`)
  },
  getRoleList(){
    return $axios.get(`/user/role/select`)
  },
  add(params){
    return $axios.post(`/user/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/user/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/user/${ids}`)
  },
  resetPassword(id){
    return $axios.put(`/user/reset/${id}`)
  },
  
}
