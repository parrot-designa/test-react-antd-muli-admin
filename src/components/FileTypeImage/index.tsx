 
import React from 'react';
import style from './index.module.less';
 
const FileTypeImage=(props)=>{

    const {
        fileType='pdf'
    }=props;

 

    return (
        <div className={style.fileTypeImage} >
            {/* <img src={mapImageUrl[fileType]} /> */}
        </div>
    )
}

export default FileTypeImage;