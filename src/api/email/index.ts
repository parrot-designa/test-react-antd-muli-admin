import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取分页数据  
  getReceive(params){
    return $axios.get(`/email/page/receive`,params)
  },
  getSend(params){
    return $axios.get(`/email/page/send`,params)
  },
  getReceivePeople(id){
    return $axios.get(`/email/receive/list/${id}`)
  },
  send(params){
    return $axios.post(`/email/?${qs.stringify(params)}`)
  },
  getDetail(id){
    return $axios.put(`/email/${id}`)
  },
  deleteReceive(ids){
    return $axios.delete(`/email/receive/${ids}`)
  },
  deleteSend(ids){
    return $axios.delete(`/email/send/${ids}`)
  }
}
