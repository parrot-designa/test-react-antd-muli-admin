import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/folder/`,params)
  },
  getAllList(){
    return $axios.get(`/folder/`)
  },
  add(params){
    return $axios.post(`/folder/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/folder/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/folder/${ids}`)
  }, 
  tree(){
    return $axios.get(`/folder/tree`)
  }, 
}
