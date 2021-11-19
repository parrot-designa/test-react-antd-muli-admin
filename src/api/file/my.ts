import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/resource/page`,{...params,isMy:true})
  },
  getAllList(){
    return $axios.get(`/resource/list`)
  },
  add(params){
    return $axios.post(`/resource/?${qs.stringify({...params,isMy:true})}`)
  },
  edit(params){
    return $axios.put(`/resource/?${qs.stringify({...params,isMy:true})}`)
  },
  recycle(params){
    return $axios.put(`/resource/recycle?${qs.stringify({...params,isMy:true})}`)
  },
  delete(ids){
    return $axios.delete(`/resource/${ids}`,{isMy:true})
  }
}
