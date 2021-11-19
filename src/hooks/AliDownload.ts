import React from 'react'
import AliOss from './AliOss'
import API from '@/api/resource/index'
 

export default async function AliDownload(  
    file?:any
) { 
    const aliOssClient = await AliOss(); 
    
    const filename=await API.download({id:file.id}) 

    const response = {
        'content-disposition': `attachment; filename=${encodeURIComponent(file.fileName)}`
    }

    const url=aliOssClient.signatureUrl(filename, { response });

    return url;

}