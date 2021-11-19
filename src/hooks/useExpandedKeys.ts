import React,{useEffect, useState} from 'react';

export default function useExpandedKeys(treeData){

    const [expandedKey,setExpandedKeys]=useState<any>([]);

    const transformTree=(treeData)=>{
        let arr=[];
        treeData.forEach(tree=>{
            const hasChildren=tree && tree.children && tree.children.length;
            if(hasChildren){
                arr.push(tree.id);
                const renderIds=transformTree(tree.children);
                if(renderIds.length){
                    arr.push(...renderIds)
                }
            }
        })
        return arr;
    }

    useEffect(()=>{ 

        if(treeData && treeData.length==0){
            setExpandedKeys(treeData)
        }else{
            setExpandedKeys(transformTree(treeData))
        }
       

    },[treeData]);

    return [expandedKey,setExpandedKeys]

}