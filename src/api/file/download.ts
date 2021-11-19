import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/download-record/page`,params)
  },
  getAllList(){
    return $axios.get(`/download-record/list`)
  },
  add(params){
    return $axios.post(`/download-record/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/download-record/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/download-record/${ids}`)
  }
}
