interface IProps{
    fileName:string
}

export default function editFiletype(name,file:IProps){
    if(file && file.fileName && file.fileName.includes('.jpg')){
        return 'jpg';
    }
    if(!name){
        return '';
    }
    if(name==='video/quicktime'){
        return 'mov';
    }
    if(name==='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
        return 'pptx';
    }
    if(name==='application/x-zip-compressed'){
        return 'zip';
    }
    if(name==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
        return 'docx';
    }
    if(name==='video/x-flv'){
        return 'flv';
    }
    if(name==='application/postscript'){
        return 'ai';
    }
    if(name==='application/vnd.ms-powerpoint'){
        return 'ppt';
    }
    if(name==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        return 'xlsx';
    }
    return name.replace(/(image\/|application\/)/,"")
}