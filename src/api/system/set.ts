import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  get(){
    return $axios.get(`/site-set/`)
  }, 
  edit(params){
    return $axios.put(`/site-set/?${qs.stringify(params)}`)
  }
}
