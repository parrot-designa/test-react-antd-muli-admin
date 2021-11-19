 
const imgUrl="https://yxs-zygl.oss-cn-beijing.aliyuncs.com/";
const fileUrl="https://yxs-zygl.oss-cn-beijing.aliyuncs.com/";


//const OSS_IMAGE_BASE_URL="http://mec.hml-media.net/"; 
export const OSS_IMAGE_BASE_URL="https://yxs-zygl.oss-cn-beijing.aliyuncs.com/"; 

export function whereType(file){
    //当识别不出filetype时
    if(file.type==="" && file.name){
        let arr=file.name.split('.');
        let type=arr.slice(arr.length-1)[0];
        return type
    }
}

export function isImage(file){
    return !!['jpg', 'jpeg', 'png', 'gif'].some((item: string) => file.type.includes(item))
}

export function getUrl(file,url){  

    if(isImage(file)){//是图片
        return url.replace(imgUrl,'').replace(/\?uploadId=(.)*$/,"")
    }else{
        return url.replace(fileUrl,'').replace(/\?uploadId=(.)*$/,"")
    }
}

export function getImageUrl(file,url){ 

    if(file===null){
        return OSS_IMAGE_BASE_URL+url;
    }
    if(isImage(file)){//是图片
        return OSS_IMAGE_BASE_URL+url
    } else{
        return OSS_IMAGE_BASE_URL+url
    }
}

export function visibleToSuccess(url){   
    return url.replace(OSS_IMAGE_BASE_URL,``)
}

export function showImage(url){
    return OSS_IMAGE_BASE_URL+url
}