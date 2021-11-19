import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/role/page`,params)
  },
  getAllList(){
    return $axios.get(`/role/list`)
  },
  add(params){
    return $axios.post(`/role/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/role/?${qs.stringify(params)}`)
  },
  editRole(params){
    return $axios.put(`/role/tree/role/?${qs.stringify(params)}`)
  },
 
  delete(ids){
    return $axios.delete(`/role/${ids}`)
  },
  tree(){
    return $axios.get(`/role/tree`)
  },
  getCurrentRolePermission(params?:Object){
    return $axios.get(`/role/user2`)
  },
  getCurrentRoleList(params){
    return $axios.get(`/role/tree/role-list`,params)
  }
}
