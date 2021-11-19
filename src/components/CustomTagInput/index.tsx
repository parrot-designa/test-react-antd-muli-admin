import React, { useRef, useCallback, useState, useEffect } from 'react';
import style from './index.module.less';
import {Tag} from 'antd';


const CustomTagInput = React.forwardRef((props: any, ref: any) => {

    const [tags, setTags] = useState([]);

    const [value,setValue]=useState('');

    const handleChangeTag=(e)=>{
        setValue(e.target.value);
    }

    const handleKeyDown=(e)=>{ 
        if(e.keyCode===13){
            setTags([...tags,value])
            props?.onChange([...tags,value])
            setValue('');
            e.stopPropagation();
            e.preventDefault();
        }
    }

    const handleCloseTag=(tagName)=>(e)=>{
        e.preventDefault();
        let index=tags.indexOf(tagName)>-1; 
        if(index){
            tags.splice(tags.indexOf(tagName),1); 
        }
        setTags([...tags]);
        props?.onChange([...tags])
    }
    
    useEffect(()=>{
        setTags((props.value||[])); 
    },[props.value])

    return (
        <div className={style.wrapper}>
            <div className={style.tagWrapper}>
                {
                    tags && !!tags.length && tags.map(item=><Tag color={"success"} key={item} closable onClose={handleCloseTag(item)}>
                        {item}
                    </Tag>)
                }
                <input  
                    placeholder={"+请输入"} 
                    value={value} 
                    onChange={handleChangeTag} 
                    className={style.input}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className={style.textWrapper}>自定义标签30字符以内</div>
        </div>
    )
})

export default CustomTagInput;