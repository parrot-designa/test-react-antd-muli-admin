import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/advert/`,params)
  },
  getAllList(){
    return $axios.get(`/advert/`)
  },
  add(params){
    return $axios.post(`/advert/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/advert/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/advert/${ids}`)
  }, 
}
