import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/user-type/page`,params)
  },
  getAllList(){
    return $axios.get(`/user-type/list`)
  },
  add(params){
    return $axios.post(`/user-type/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/user-type/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/user-type/${ids}`)
  },  
  tree(params?:any){
    return $axios.get(`/user-type/tree`,params)
  }, 
}
