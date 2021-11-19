import React ,{useRef,useCallback} from 'react';
import style from './index.module.less';
import { Button, Space } from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    FilterOutlined,
    ExportOutlined,
    PrinterOutlined,
    ScissorOutlined 
} from '@ant-design/icons';
import useForkRef from '@/hooks/useForkRef';

 
const CustomButton = React.forwardRef((props:any,ref:any) => {

    const { children,size="small",shape,type="add",icon=true,addText="添加",editText="编辑",deleteText="删除",searchText="查询",onClick } = props;

    const renderType={
        "add":"primary",
        "delete":"danger",
        "column":"default",
        "export":"default",
        "print":"default", 
        'default':'default',
        'warning':'warning',
        'sheer':'warning',
    }

    const customRef=useRef(); 

    const handleRef=useForkRef(customRef,ref);

    return (
        <Button 
            size={size}
            onClick={onClick}
            type={renderType[type]}
            shape={shape} 
            ref={handleRef}
            className={(type==='warning'||type==="sheer")?style.warningButton:''} 
        >
            {type==='add' && <><PlusOutlined />{addText}</>}
            {type==='delete' && <>{icon && <DeleteOutlined />}{deleteText}</>}
            {type==='edit' && <><EditOutlined />{editText}</>}
            {type==='search' && <><SearchOutlined />{searchText}</>}
            {type==='column' && <><FilterOutlined /> </>}
            {type==='export' && <><ExportOutlined /></>}
            {type==='print' && <><PrinterOutlined /></>}
            {type==='sheer' && <><ScissorOutlined /></>}
            {(type==='default'||type==='warning'||type==='sheer') && children}
        </Button>
    )
})

export default CustomButton;