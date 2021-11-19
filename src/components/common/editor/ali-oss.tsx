//@ts-nocheck
import { message } from 'antd'
import OSS from 'ali-oss'
import moment from 'moment'
import common from '@/api'

export default async function ossUpload(
  progressFn?: (arg0?: number) => void,
  uploadFile?: CommonObjectType
) {
  const {
    t:{
      accessKeyId,
      accessKeySecret,
      securityToken: stsToken
    }
  } = await common.getOSS() 

  const client = () => {
    return new OSS({ 
      region:'oss-cn-beijing',
      accessKeyId,
      accessKeySecret,
      stsToken, 
      bucket:'yxs-zygl'
    })
  }
  // 要上传到oss上的路径
  const uploadPath = (path: string, file: CommonObjectType) => {
    return `/${path}/${moment().format('YYYYMMDD')}/${+new Date()}.${
      file.type.split('/')[1]
    }`
  }
  // 可选参数
  const extraParams = {
    progress: (p: number) => {
      progressFn(p)
    }
  }
  // 直传到oss方法
  const uploadToOss = (path: string, file: CommonObjectType) => {
    message.loading({ content: '上传中...', key: 'updatable', duration: 0 })
    const url = uploadPath(path, file) 
    return new Promise((resolve, reject) => {
      client()
        .multipartUpload(url, file, extraParams)
        .then((data: unknown) => { 
          resolve(data)
        })
        .catch((error: unknown) => {
          reject(error)
        })
   
    })
  }

  return uploadToOss('videos', uploadFile,extraParams)
}
