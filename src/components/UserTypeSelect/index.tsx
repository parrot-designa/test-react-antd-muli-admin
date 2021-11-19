import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import roleApi from '@/api/user/utype'
import { useStore } from 'react-redux';

const { Option } = Select;

const TagSelect = React.forwardRef((props: any, ref: any) => {
    const { onChange } =props;

    const [roleList, setRoleList] = useState([]);

    const [value, setValue] = useState(undefined);

    useEffect(() => {
        roleApi.tree().then((res) => {
            setRoleList(res)
        })
    }, []);

  

    useEffect(()=>{ 
        setValue(props.value)
    },[props.value])

    const handleChangeSelect = (value) => { 
        setValue(value);
        onChange?.(value)
    }
 

    return (
        <>
            <Select defaultValue={undefined} value={value===0?null:value} style={{ width: 120 }} onChange={handleChangeSelect}>
                <Option value={undefined}>请选择</Option>
                {
                    roleList.map((item)=>(
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                    ))
                }
            </Select>
        </>
    )
})

export default TagSelect;