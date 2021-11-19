import { useEffect } from "react";

export default function useClickListener(callback,...dependencies){

    useEffect(()=>{
        window.addEventListener('click',callback)

        return ()=>{
            window.removeEventListener('click',callback)
        }

    },[...dependencies])

}