import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';  
import typeApi from '@/api/system/rtype';

const ResourceTreeSelect = React.forwardRef((props: any, ref: any) => {
    const { onChange } =props;

    const [roleList, setRoleList] = useState([]);

    const [value, setValue] = useState(undefined);

    useEffect(() => {
        typeApi.tree().then((res) => {
            setRoleList(res)
        })
    }, []);  

    const handleChangeSelect=(value,label,extra)=>{  
        setValue(value) 

        onChange?.(value)
    }

    useEffect(()=>{
        setValue(props.value)
    },[props.value])

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
                value={value===0?null:value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={renderTreeData}
                placeholder="Please select"
                treeDefaultExpandAll 
                onChange={handleChangeSelect}
            />
        </>
    )
})

export default ResourceTreeSelect;