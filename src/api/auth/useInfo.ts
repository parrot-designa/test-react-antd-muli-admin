import $axios from '@/utils/axios' 

export default { 
  getInfo(){
    return $axios.get(`/auth/session`)
  },
 
}
