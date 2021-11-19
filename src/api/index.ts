import $axios from '@/utils/axios'

export default {
  // 获取数据
  getList(params?: object): Promise<CommonObjectType<string>> {
    return $axios.get('https://randomuser.me/api', params)
  },
  getOSS(params?: object): Promise<CommonObjectType<string>>|any {
    return $axios.get('/auth/oss-sts', params)
  }
}
