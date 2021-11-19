import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/label/page`,params)
  },
  getAllList(){
    return $axios.get(`/label/list`)
  },
  add(params){
    return $axios.post(`/label/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/label/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/label/${ids}`)
  }, 
  tree(params?:any){
    return $axios.get(`/label/tree`,params)
  }, 
}
