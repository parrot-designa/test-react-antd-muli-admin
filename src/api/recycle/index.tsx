import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getList(params){
    return $axios.get(`/resource/page`,{...params,isMy:true,fileState:1})
  },
  getAllList(){
    return $axios.get(`/resource/list`)
  },
  add(params){
    return $axios.post(`/resource/?${qs.stringify({...params,isMy:true,fileState:1})}`)
  },
  edit(params){
    return $axios.put(`/resource/?${qs.stringify({...params,isMy:true,fileState:1})}`)
  },
  recycleRe(ids){
    return $axios.put(`/resource/recycle-re?${qs.stringify({ids:ids})}`)
  },
  delete(ids){
    return $axios.delete(`/resource/${ids}`,{isMy:true,fileState:1})
  },

}
