import $axios from '@/utils/axios'
import qs from 'qs'

export default {
  // 获取数据 
  login(params?:Object){
    return $axios.post(`/login?${qs.stringify(params)}`)
  }
}
