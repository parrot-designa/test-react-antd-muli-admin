import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/notice/page`,params)
  },
  getAllList(){
    return $axios.get(`/notice/list`)
  },
  add(params){
    return $axios.post(`/notice/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/notice/?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/notice/${ids}`)
  }
}
