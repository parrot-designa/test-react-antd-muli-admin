
import copy from 'clipboard-copy';
import { message } from 'antd';

export default function share(extra){
    let path=window.location.href
    if(extra){
        path=`https://${window.location.host}${window.location.pathname}#${extra}`
    }
    copy(path)
    message.info('文件地址已复制到剪贴板')
}