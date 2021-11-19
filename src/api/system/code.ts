import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/code/page`,params)
  },
  getAllList(){
    return $axios.get(`/code/list`)
  },
  add(params){
    return $axios.post(`/code/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/code/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/code/${ids}`)
  }, 
}
