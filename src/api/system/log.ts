import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/system-log/page`,params)
  },
  getAllList(){
    return $axios.get(`/system-log/`)
  },
  add(params){
    return $axios.post(`/system-log/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/system-log/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/system-log/${ids}`)
  }, 
}
