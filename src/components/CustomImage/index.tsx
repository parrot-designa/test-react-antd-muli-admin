import React, { useState, useRef, useEffect } from 'react';
import { Modal, Image } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from './index.module.less';
import ReactDOM from 'react-dom';

const CustomImage = React.forwardRef((props: any, ref: any) => {

    const { visible,current=-1 } = props;

    const imgRef: any = useRef(null)

    const [imgList, setImgList] = useState([
        'http://mec.peugeot.com.cn/upload/file_material/20200512/1589274394160561ab4e619a1c.jpg',
        'http://mec.peugeot.com.cn/upload/20210503/26441034bc3f330bc2078ab33399cb0f.jpeg',
        'http://mec.peugeot.com.cn/upload/20210407/9de1afd63f21759bd9f68276dc15d983.jpg'
    ]);

    useEffect(() => {
        
    }, [visible])

    const handleVisibleChange = (...args) => { 
    }

    return (
        <div ref={imgRef}>
            <Image.PreviewGroup preview={{current:current}}>
                {
                    imgList.map(item => (
                        <Image src={item} style={{ display: 'none' }} preview={{ onVisibleChange: handleVisibleChange, mask: false }} />
                    ))
                }
            </Image.PreviewGroup> 
        </div>
    )
})

export default CustomImage;