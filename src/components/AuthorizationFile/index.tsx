import React, { useState } from 'react';
import style from './index.module.less';
import { Input, Button } from 'antd';


const AuthorizationFile = (props) => {

    const [value, setValue] = useState([{ value: "" }]);

    const handleChangeInput=(index)=>(e)=>{ 
        const currentIndex=value.findIndex((item,indexA)=>index===indexA); 
        if(currentIndex>-1){
            value.splice(currentIndex,1,{value:e.target.value}); 
            setValue([...value]);
            props?.onChange?.([...value]);
        }
    }

    const handleClick=(index)=>(e)=>{
        if(index===0){
            value.push({value:""});
            setValue([...value]);
        }else{
            const currentIndex=value.findIndex((item,indexA)=>index===indexA);
            value.splice(currentIndex,1);
            setValue([...value]);
            props?.onChange?.([...value]);
        }
    }

    return (
        <div className={style.wrapper}>

            {value.map((item, index) => { 
                return (
                    <div className={style.inputWrapper} key={index}>
                        <Input className={style.input} value={item.value} onChange={handleChangeInput(index)}/>
                        <Button className={style.button} onClick={handleClick(index)}>{index===0?'添加':'删除'}</Button>
                    </div>
                )
            })}

        </div>
    )
}

export default AuthorizationFile;