 
import React from 'react';
import style from './index.module.less';

const Copy_IMG=require('./copy.png');
const Download_IMG=require('./download.png');

const ActionButton=(props)=>{

    const {
        type='download'
    }=props;

    const mapImageUrl={
        'copy':Copy_IMG,
        'download':Download_IMG,
    }

    return (
        <div className={style.fileTypeImage} style={{width:type==='download'?40:30}} onClick={props?.onClick}>
            <img src={mapImageUrl[type]} />
        </div>
    )
}

export default ActionButton;