import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/ad/page`,params)
  },
  getAllList(){
    return $axios.get(`/ad/list`)
  },
  add(params){
    return $axios.post(`/ad/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/ad/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/ad/${ids}`)
  }, 
}
