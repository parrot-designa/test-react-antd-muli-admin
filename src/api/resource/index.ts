import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/resource/page`,params)
  },
  getAllList(){
    return $axios.get(`/resource/list`)
  },
  getDetail(id){
    return $axios.get(`/resource/${id}`)
  },
  add(params){
    return $axios.post(`/resource/?${qs.stringify(params)}`)
  },
  edit(params){
    return $axios.put(`/resource/?${qs.stringify(params)}`)
  },
  recycle(params){
    return $axios.put(`/resource/recycle?${qs.stringify(params)}`)
  },
  delete(ids){
    return $axios.delete(`/resource/${ids}`)
  },
  move(params){
    return $axios.put(`/resource/move?${qs.stringify(params)}`)
  },
  download(params){
    return $axios.get(`/resource/download`,params)
  }
}
