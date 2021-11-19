import React, { useEffect,useState } from 'react';
import { Select } from 'antd';
import roleApi from '@/api/permissions/role'
import { useStore } from 'react-redux';

const { Option } = Select; 

const RoleSelect = React.forwardRef((props: any, ref: any) => {

    const { visible, title, children, type, size = "small", onChange } = props;

    const [roleList,setRoleList]=useState([]);

    const [value,setValue]=useState([]);

    useEffect(()=>{
        roleApi.getAllList().then((res)=>{ 
            setRoleList(res)
        })
    },[]);

    

    const handleChangeSelect=(value)=>{ 
        setValue([...value]); 
        const roles=value && value.map(item=>{
            return {
                id:item,
                name:roleList.find(itemA=>itemA.id===item)?.name
            }
        })
        onChange?.(roles);
    }

    useEffect(()=>{  
        const isAllNumber=!props?.value?.find(item=>typeof(item)!=="number"); 
        if(isAllNumber && roleList.length){ 
            setValue(props.value)  
            const roles=props.value && props.value.map(item=>{
                return {
                    id:item,
                    name:roleList.find(itemA=>itemA.id===item)?.name
                }
            }) 
            onChange?.(roles);
        }
        
    },[props.value,roleList]) 

    return (
        <>
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择一个角色" 
                optionLabelProp="label"
                value={value}
                onChange={handleChangeSelect}
            >
                {
                    roleList.map((item)=>(
                        <Option value={item.id} label={item.name} key={item.id}>
                            {item.name}
                        </Option>
                    ))
                }
            </Select>
        </>
    )
})

export default RoleSelect;