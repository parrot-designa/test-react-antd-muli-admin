const kbToMd=(size)=>{
    if(size){
        if(size>1000*1000*1000){
            return `${(size/1000/1000/1000).toFixed(2)}GB`
        }else if(size>1000*1000){ 
            return `${(size/1000/1000).toFixed(2)}MB`
        }else if(size>1000){
            return `${(size/1000).toFixed(2)}KB`
        }else{
            return `${size.toFixed(2)}B`
        }
    }else{
        return 0
    }
    
}

export {
    kbToMd
}