import React from 'react';
import { Image } from 'antd';
import { showImage } from '@/utils/getSuccessUrl';

const CarouselImage = (props) => {

    const { imgList=[],visible,current,onVisibleChange } =props;

    return (
        <Image.PreviewGroup preview={{visible,current,onVisibleChange}}>
            {
                imgList.map((img)=>(
                    <Image 
                        height={0}
                        width={0}
                        src={showImage(img.image)}
                    />
                ))
            } 
        </Image.PreviewGroup>
    )
}

export default CarouselImage;