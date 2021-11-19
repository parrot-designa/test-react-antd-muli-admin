import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';  
import typeApi from '@/api/user/manager';

const { SHOW_PARENT,SHOW_CHILD } = TreeSelect;

const UserSelectAboutCompany = React.forwardRef((props: any, ref: any) => {
    const { onChange } =props;

    const [list, setList] = useState([]);

    const [value, setValue] = useState([]);

    useEffect(() => {
        typeApi.getRoleList().then((res) => {
            setList(res)
        })
    }, []); 

    const findItemById=(id)=>{ 
        let oneItem;
        list.forEach(item=>{
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
 
        // setValue(value)
        // const item=findItemById(value) 

        onChange?.(value)
    }

    useEffect(()=>{
        if(typeof props.value==="number" && list.length){ 
            setValue(props.value)
            const item=findItemById(props.value)
            onChange?.({
                item,
                id:props.value,
                isLevelOne:item.pid===0,
                company:item.name
            }) 
        }
    },[props.value,list])

    const transformTree = (treeData) => {  
        return treeData.map(item => {
            if (item.users && item.users.length) {
                let childrens = transformTree(item.users);
                return ({
                    title: item.typeName||item.username,
                    key: item.typeId?`P_${item.typeId}`:item.id,
                    children: childrens
                })
            }
            return ({
                title: item.typeName||item.username,
                key: item.typeId?`P_${item.typeId}`:item.id,
            })
        })
    } 

    const renderTreeData = transformTree(list.filter(item=>item.users && item.users.length)); 

    return (
        <>
             <TreeSelect
                style={{ width: '100%' }}
                // value={value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={renderTreeData}
                placeholder="Please select"
                treeCheckable={true}
                treeDefaultExpandAll 
                showCheckedStrategy={SHOW_CHILD}
                onChange={handleChangeSelect}
            />
        </>
    )
})

export default UserSelectAboutCompany;