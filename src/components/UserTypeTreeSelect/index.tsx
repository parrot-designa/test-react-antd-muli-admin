import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';  
import typeApi from '@/api/user/utype';

const UserTypeTreeSelect = React.forwardRef((props: any, ref: any) => {
    const { onChange } =props;

    const [roleList, setRoleList] = useState([]);

    const [value, setValue] = useState(undefined);

    useEffect(() => {
        typeApi.tree().then((res) => {
            setRoleList(res)
        })
    }, []); 

    const findItemById=(id)=>{ 
        let oneItem;
        roleList.forEach(item=>{
            if(item.id===id){
                oneItem=item; 
            }
            if(item.children && item.children.length){
                item.children.forEach(itemA=>{
                    if(itemA.id===id){
                        oneItem=itemA; 
                    }
                })
            }
        })
        return oneItem;
    }

    const handleChangeSelect=(value,label,extra)=>{  
        setValue(value)
        const item=findItemById(value)||{}

        onChange?.({
            item,
            id:value,
            isLevelOne:item.pid===0,
            company:item.name
        })
    }

    useEffect(()=>{
        if(typeof props.value==="number" && roleList.length){ 
            setValue(props.value)
            const item=findItemById(props.value)||{}
            onChange?.({
                item,
                id:props.value,
                isLevelOne:item.pid===0,
                company:item.name
            }) 
        }
    },[props.value,roleList])

    const transformTree = (treeData) => {  
        return treeData.map(item => {
            if (item.children && item.children.length) {
                let childrens = transformTree(item.children);
                return ({
                    title: item.name,
                    key: item.id,
                    children: childrens
                })
            }
            return ({
                title: item.name,
                key: item.id
            })
        })
    }

    const renderTreeData = transformTree(roleList);
 

    return (
        <>
             <TreeSelect
                style={{ width: '100%' }}
                value={value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={renderTreeData}
                placeholder="Please select"
                treeDefaultExpandAll 
                onChange={handleChangeSelect}
            />
        </>
    )
})

export default UserTypeTreeSelect;