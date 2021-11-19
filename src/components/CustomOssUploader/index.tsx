import React, { useState,useRef, useEffect } from 'react';
import { Image,Space } from 'antd';
import style from './index.module.less';
import CustomUploader from '@/components/CustomUploader/index';
import {
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons'; 
import {
    visibleToSuccess,
    getImageUrl,
    OSS_IMAGE_BASE_URL
} from '@/utils/getSuccessUrl';


const CustomOssUploader = React.forwardRef((props: any, ref: any) => {
 

    const [imgVisible,setImgVisible]=useState(false);

    const [imgList,setImgList]=useState([]);

    const imgLoaderRef=useRef(null); 

    const handleSuccessUpload=()=>{  

        let successUrl = imgLoaderRef.current.fileList[0].visibleUrl;

        if(props.special){
            successUrl=successUrl.replace(OSS_IMAGE_BASE_URL,'')
        }
        imgList.push(successUrl)

        console.log("handleSuccessUpload",imgList)

        setImgList([...imgList])
        props?.onChange?.(imgList.map(item=>visibleToSuccess(item)))
    }

    const handleClickDelete = (e, current) => {
        e.preventDefault();
        e.stopPropagation();
        setImgList(imgList.filter(item => item!== current))
        props?.onChange?.(imgList.filter(item => item!== current))
    }

    useEffect(()=>{ 
        if(props.type!=='add'){ 
            setImgList(props.value.map(item=>getImageUrl(null,item))||[]) 
        } 
    },[props.value,props.type]);

  

    // debugger; 

    return (
        <>
            <CustomUploader visible={imgVisible} max={1} ref={imgLoaderRef} successUploader={handleSuccessUpload} onCancel={() => setImgVisible(false)} />
            <div className={style.wrapper}>
                {
                    imgList.map(item=>(<Image
                        height={100}
                        width={100}
                        src={item}
                        key={item}  
                        preview={{ 
                            mask: (
                                <div style={{position:'relative'}}>
                                    <Space direction="vertical" align="center">
                                        <div><EyeOutlined /></div>
                                        <div onClick={(e) => handleClickDelete(e, item)}><DeleteOutlined /></div>
                                    </Space> 
                                </div>
                            ),
                        }}
                    />))
                }
                <div className={style.uploaderCard} onClick={() => setImgVisible(true)} >
                    <PlusOutlined />
                </div>
            </div>
        </>
    )
})

export default CustomOssUploader;