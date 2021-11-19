//@ts-nochecked
import React,{ useEffect, useState } from 'react';


export default function useWindowResize(height){

    const [customHeight,setCustomHeight]=useState(0); 

    useEffect(()=>{
        setCustomHeight(window.innerHeight-height)
        let resizeCall=(...args)=>{ 
            setCustomHeight(window.innerHeight-height)
        }
        window.addEventListener('resize',resizeCall);

        return ()=>{
            window.removeEventListener('resize',resizeCall);
        }
    },[])

    return [customHeight]
}