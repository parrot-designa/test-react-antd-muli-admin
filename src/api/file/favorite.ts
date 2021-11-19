import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/favorite/page`,params)
  },
  getAllList(){
    return $axios.get(`/favorite/list`)
  },
  add(params){
    return $axios.post(`/favorite/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/favorite/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/favorite/${ids}`)
  }
}
